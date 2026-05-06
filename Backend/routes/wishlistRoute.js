const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyUser")
const Wishlist = require("../models/wishlist")


router.post("/add", verifyToken, async (req, res) => {
    try {
        const { productId, variantId } = req.body;
        console.log(productId, "productId");
        const userId = req.userId;
        let w = await Wishlist.findOne({ user: userId })
        if (w && w.items.some(item => item.product.equals(productId) && item.variantId?.toString() === variantId?.toString())) {
            return res.status(400).json({ message: "Product already added to wishlist" });
        }
        if (w) {
            w.items.push({ product: productId, variantId: variantId });
            await w.save();
            res.status(201).json({ message: "Product added to wishlist", wishlist: w });
        } else {
            const wishlist = new Wishlist({ user: userId, items: { product: productId, variantId: variantId } });
            await wishlist.save();
            res.status(201).json({ message: "Product added to wishlist", wishlist });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add product to wishlist" });
    }

})

router.get("/get-wishlist", verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.userId }).populate("items.product", 'title images variants');
        res.status(200).json({ wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get wishlist" });
    }

})

router.delete("/remove/:id/:variantId", verifyToken, async (req, res) => {
    try {
        const { id, variantId } = req.params;
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        const updatedProducts = wishlist.items.filter(item => {
            const matchProduct = item.product.toString() === id;
            const matchVariant = variantId === "null" || variantId === "undefined" ? !item.variantId : item.variantId?.toString() === variantId;
            return !(matchProduct && matchVariant);
        });
        wishlist.items = updatedProducts;
        await wishlist.save();
        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to remove product from wishlist" });
    }
})
module.exports = router;