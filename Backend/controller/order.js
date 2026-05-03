const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { orderConfirmedMail } = require("../services/OrderConfirmedMail.js");
const getOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .populate("user");

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
}

const getOrdersById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.userId
        })
            .populate("items.product")
            .populate("user");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Error fetching order", error: err.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const { items, paymentMethod, shippingAddress, paymentStatus } = req.body;

        items.forEach(async (item) => {
            const product = await Product.findById(item.product);
            product.soldCount += item.quantity;
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
            if (variant.stock < item.quantity) {
                return res.status(400).json({ message: "Stock is not enough" });
            }
            variant.stock -= item.quantity;
            await product.save();
        })
        const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newOrder = new Order({ items, paymentMethod, totalPrice, shippingAddress, paymentStatus, user: req.userId })
        await newOrder.save()
        const user = await User.findById(req.userId)
        await orderConfirmedMail(user, newOrder)

        res.status(201).json({ msg: "Order creatd successfully", newOrder });

    } catch (err) {
        (err)
        res.status(500).json({ message: "Failed to create Order", message: err })
    }

}


const orderItemCancel = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { productId, variantId } = req.body;
        (productId, variantId, orderId, "idsss")

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // AUTH CHECK
        if (
            order.user.toString() !== req.userId

        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (order.status === "shipped" || order.status === "delivered") {
            return res.status(400).json({
                message: "Cannot cancel after shipping",
            });
        }

        const productItem = order.items.find(
            (item) =>
                item.product.toString() === productId &&
                item.variantId.toString() === variantId
        );

        if (!productItem) {
            return res.status(404).json({ message: "Product not found in order" });
        }

        if (productItem.status === "cancelled") {
            return res.status(400).json({ message: "Already cancelled" });
        }

        // restore stock
        const product = await Product.findById(productId);

        const variant = product.variants.find(
            (v) => v._id.toString() === variantId.toString()
        );

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        variant.stock += productItem.quantity;
        await product.save();

        // cancel item
        productItem.status = "cancelled";
        if (order.items.every((item) => item.status === "cancelled")) {
            order.status = "cancelled";
        }
        // optional: recalc order total
        order.total = order.items.reduce((sum, item) => {
            if (item.status === "cancelled") return sum;
            return sum + item.price * item.quantity;
        }, 0);

        await order.save();

        res.status(200).json({
            message: "Item cancelled successfully",
            order,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to cancel product",
            error: err.message,
        });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = status;

        await order.save();
        res.status(200).json({ message: "Product status updated", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to update product status", error: err.message });
    }
}


const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order", error: err.message });
    }
}


module.exports = {
    getOrders,
    getOrdersById,
    createOrder,
    orderItemCancel,
    updateOrderStatus,
    deleteOrder
}