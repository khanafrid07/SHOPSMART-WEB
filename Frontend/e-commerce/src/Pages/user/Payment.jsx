import { useState } from "react";
import { useGetCartQuery, useClearCartMutation } from "../../features/cart/cart.js";
import { useCreateOrderMutation } from "../../features/orders/orderSlice.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { notifyError, notifySuccess } from "../../utils/notify.js";

export default function Payment() {
  const { currentAddress } = useSelector((state) => state.auth);

  const { data: cartData, isLoading, isError } = useGetCartQuery();
  const [createOrder] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const items = cartData?.items || [];
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) return <p className="p-6 text-center">Loading cart...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Error loading cart.</p>;
  if (!items.length) return <p className="p-6 text-center">Your cart is empty.</p>;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double click

    if (!paymentMethod) {
      notifyError("Please select a payment method.");
      return;
    }

    if (!currentAddress) {
      notifyError("Please select a delivery address.");
      return;
    }

    setLoading(true);

    const orderItems = items.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      price: item.price,
      quantity: item.quantity,
      variantId: item.variantId,
      variantLabel: item.variantLabel,
      image: item.image,
    }));

    const orderData = {
      items: orderItems,
      totalPrice: total,
      paymentMethod,
      shippingAddress: currentAddress,
      paymentStatus: "pending",
    };

    try {
      // ---------------- CASH ON DELIVERY ----------------
      if (paymentMethod === "Cash") {
        await createOrder(orderData).unwrap();
        await clearCart().unwrap();

        notifySuccess("Order placed successfully!");
        navigate("/orders");
        return;
      }

      // ---------------- CARD PAYMENT ----------------
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100 }),
      });

      if (!res.ok) {
        throw new Error("Payment intent failed");
      }

      const { clientSecret } = await res.json();

      if (!stripe || !elements) {
        throw new Error("Stripe not ready");
      }

      const card = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: `${currentAddress.firstName} ${currentAddress.lastName}`,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        const paidOrder = {
          ...orderData,
          paymentStatus: "paid",
        };

        // run in parallel (faster)
        await Promise.all([
          createOrder(paidOrder).unwrap(),
          clearCart().unwrap(),
        ]);

        notifySuccess("Payment successful & order placed!");
        navigate("/orders");
      }
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="bg-base-100 rounded-2xl shadow-lg w-[95%] md:w-[90%] grid grid-cols-1 md:grid-cols-[4fr_3fr] gap-8 p-6 md:p-10">

        {/* LEFT - SUMMARY */}
        <div className="border-b md:border-b-0 md:border-r md:pr-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          <div className="overflow-y-auto max-h-[50vh] mb-4 pr-2">
            {items.map((item) => (
              <div key={item.variantId} className="border rounded flex gap-4 items-center p-2 mb-2">
                <img
                  className="w-20 h-20 object-cover rounded"
                  src={item.image || "/placeholder.png"}
                  alt={item.product.title}
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-xs text-gray-500">{item.variantLabel}</p>
                  <p className="text-xs">Qty: {item.quantity}</p>
                </div>

                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹0</span></div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>

          <div className="space-y-2 mb-4">
            {["Cash", "Card"].map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method === "Cash" ? "Cash on Delivery" : "Card"}
              </label>
            ))}

            {paymentMethod === "Card" && (
              <div className="border p-4 rounded">
                <CardElement />
              </div>
            )}
          </div>

          <div className="border p-4 rounded mb-4">
            <h3 className="font-semibold">Delivery Address</h3>
            {currentAddress ? (
              <p>{currentAddress.city}, {currentAddress.state}</p>
            ) : (
              <p className="text-gray-500">No address selected</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}