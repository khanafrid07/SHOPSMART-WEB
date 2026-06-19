const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { orderConfirmedMail } = require("../services/OrderConfirmedMail.js");
const emailQueue = require("../queues/email.queue.js")
const getMyOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .populate("user")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
}

const adminGetOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("items.product")
            .populate("user")
            .sort({ createdAt: -1 });

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

        let totalPrice = 0;

        // process sequentially (safe for stock)
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const variant = product.variants.find(
                v => v._id.toString() === item.variantId.toString()
            );

            if (!variant) {
                return res.status(404).json({ message: "Variant not found" });
            }

            if (variant.stock < item.quantity) {
                return res.status(400).json({ message: "Stock is not enough" });
            }

            variant.stock -= item.quantity;
            product.soldCount += item.quantity;

            await product.save();

            totalPrice += item.price * item.quantity;
        }

        const newOrder = await Order.create({
            items,
            paymentMethod,
            totalPrice,
            shippingAddress,
            paymentStatus,
            user: req.userId,
        });

        const user = await User.findById(req.userId);

        if (user) {
            emailQueue.add("sendOrderConfirmedMail", { user, newOrder }, {
                attempts: 3,
                backoff: {
                    delay: 2000,
                    type: "exponential"
                }
            })
        }

        return res.status(201).json({
            msg: "Order created successfully",
            newOrder,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to create Order",
            error: err.message,
        });
    }
};

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
    getMyOrders,
    adminGetOrders,
    getOrdersById,
    createOrder,
    orderItemCancel,
    updateOrderStatus,
    deleteOrder
}