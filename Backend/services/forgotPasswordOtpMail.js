const { sendMail } = require("./resend")
const forgotPasswordOtpMail = async (to, name, otp) => {
    await sendMail({
        to,
        subject: "Forgot Password - ShopSmart",
        text: `Hi ${name}, \n\n Here is your OTP to reset your password: ${otp}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nShopSmart Team`
    })
}
module.exports = { forgotPasswordOtpMail }