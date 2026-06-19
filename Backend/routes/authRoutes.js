const express = require("express")

const { verifyToken } = require("../middlewares/verifyUser.js");
const router = express.Router()


const { sendOtp, verifyOtp, login, fetchUser, address, googleLogin, refreshAccessToken, logout, forgotPasswordSendOtp, forgotPasswordVerifyOtp } = require("../controller/auth.js");


router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/login", login)
router.post("/google", googleLogin);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password/send-otp", forgotPasswordSendOtp)
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp)
router.post("/logout", logout);
router.get("/fetchUser", fetchUser)
router.post("/address", verifyToken, address)
module.exports = router