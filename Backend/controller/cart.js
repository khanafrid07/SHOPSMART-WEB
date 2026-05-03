const Cart = require("../models/cart");
const Product = require("../models/product");




const getCart = async (req, res) => {
    try {
        const count = req.query.count
        console.log(req.query, "query")

        if (count) {
            const cart = await Cart.findOne({ user: req.userId });
            return res.status(200).json({ count: cart ? cart.items.length : 0 });
        }

        const cart = await Cart.findOne({ user: req.userId }).populate("items.product");

        if (!cart) return res.status(200).json({ items: [], totalPrice: 0 });

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart", error: err.message });
    }
}


const addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;

        let existingCartItems = await Cart.findOne({ user: req.userId });

        const product = await Product.findById(productId);
        if (product.stock === 0) {
            return res.status(400).json({ message: "Product is out of stock" })
        }

        const variant = product.variants.find(
            (v) => v._id.toString() === variantId
        );
        if (!variant) {
            return res.status(404).json({ message: "Variant not found" })
        }
        if (variant.stock === 0) {
            return res.status(400).json({ message: "Variant is out of stock" })
        }
        const originalPrice = variant.price;
        const discount = variant.discount || 0;

        const finalPrice =
            originalPrice - (originalPrice * discount) / 100;

        const image =
            variant.images?.length > 0
                ? variant.images[0].url
                : product.images?.[0]?.url;

        const variantLabel = Object.values(variant.attributes || {})
            .join(" | ");

        if (existingCartItems) {
            let findExistingItem = existingCartItems.items.find(
                (item) =>
                    item.product.toString() === productId &&
                    item.variantId.toString() === variantId
            );

            if (findExistingItem) {
                findExistingItem.quantity += quantity;
            } else {
                existingCartItems.items.push({
                    product: productId,
                    variantId,
                    quantity,
                    price: finalPrice,
                    variantLabel,
                    image,
                });
            }

            existingCartItems.totalPrice = existingCartItems.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await existingCartItems.save();

            return res.status(200).json({
                message: "Cart Updated",
                cart: existingCartItems,
            });
        }

        const newCartItem = new Cart({
            user: req.userId,
            items: [
                {
                    product: productId,
                    variantId,
                    quantity,
                    price: finalPrice,
                    variantLabel,
                    image,
                },
            ],
            totalPrice: finalPrice * quantity,
        });

        await newCartItem.save();

        return res.status(201).json({
            message: "Item Added to Cart",
            cart: newCartItem,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Failed To Add in Cart",
            error: err.message,
        });
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        (productId, "pid", variantId, "vid", quantity, "qty")
        const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((item) => {
            return item.product._id.toString() === productId.toString() && item.variantId.toString() === variantId.toString()
        })

        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        await cart.save();
        res.json({ updatedItem: item, totalPrice: cart.totalPrice });

    } catch (err) {
        res.status(500).json({ message: "Error Updating Cart", error: err?.message })
    }
}

const removeItem = async (req, res) => {
    try {
        const { id, variantId } = req.params;

        (" Removing item:", { id, variantId });

        const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((item) => {
            return item.product._id.toString() === id.toString() && item.variantId.toString() === variantId.toString()
        })
        if (!item) return res.status(404).json({ message: "Item not in cart" });
        cart.items = cart.items.filter((item) => {
            return item.product._id.toString() !== id.toString() || item.variantId.toString() !== variantId.toString()
        })
        cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        await cart.save();
        res.json({ message: "Item removed successfully", cart });

    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
}

const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.userId });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: "Error clearing cart", error: err.message });
    }
}

module.exports = { getCart, addToCart, updateCart, removeItem, clearCart }