const express = require("express")

const { payment_intent } = require("../controller/payment.js");
const router = express.Router();


router.post("/create-intent", payment_intent)

module.exports = router