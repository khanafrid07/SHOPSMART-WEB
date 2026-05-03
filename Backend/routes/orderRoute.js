const express = require("express");
const router = express.Router();
const { verifyToken: verifyUser } = require("../middlewares/verifyUser");

const { getOrders, getOrdersById, createOrder, orderItemCancel, updateOrderStatus, deleteOrder } = require("../controller/order");


router.get("/", verifyUser, getOrders);


router.get("/:id", verifyUser, getOrdersById);


router.post("/", verifyUser, createOrder);


router.put("/:orderId/items/cancel", orderItemCancel);

router.put("/:orderId/", updateOrderStatus);


router.delete("/:id", deleteOrder);

module.exports = router;
