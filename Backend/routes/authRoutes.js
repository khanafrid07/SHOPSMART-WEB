const express = require("express")

const { verifyToken } = require("../middlewares/verifyUser.js");
const router = express.Router()


const { sendOtp, verifyOtp, login, fetchUser, address, googleLogin } = require("../controller/auth.js");


router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/login", login)
router.post("/google", googleLogin);

router.get("/fetchUser", fetchUser)

router.post("/address", verifyToken, address)

module.exports = router