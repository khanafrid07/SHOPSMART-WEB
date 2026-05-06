const express = require("express");
const router = express.Router();
const { verifyToken: verifyUser, verifyAdmin } = require("../middlewares/verifyUser");

const { getMyOrders, adminGetOrders, getOrdersById, createOrder, orderItemCancel, updateOrderStatus, deleteOrder } = require("../controller/order");


router.get("/", verifyUser, getMyOrders);

router.get("/admin", verifyUser, verifyAdmin, adminGetOrders);


router.get("/:id", verifyUser, getOrdersById);


router.post("/", verifyUser, createOrder);


router.put("/:orderId/items/cancel", verifyUser, orderItemCancel);

router.put("/:orderId/", verifyUser, verifyAdmin, updateOrderStatus);


router.delete("/:id", verifyUser, verifyAdmin, deleteOrder);

module.exports = router;
