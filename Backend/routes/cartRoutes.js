
const express = require("express");
const { verifyToken } = require("../middlewares/verifyUser");
const { getCart, addToCart, updateCart, removeItem, clearCart } = require("../controller/cart");
const router = express.Router();


router.get("/", verifyToken, getCart);

router.post("/add", verifyToken, addToCart);


router.put("/update", verifyToken, updateCart)


router.delete("/remove/:id/:variantId", verifyToken, removeItem);


router.delete("/clear", verifyToken, clearCart);

module.exports = router;



