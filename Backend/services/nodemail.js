const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (options) => {
    console.log("Attempting to send email with user:", process.env.EMAIL_USER);
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        console.log("Email sent successfully to:", options.to);
    }
    catch (error) {
        console.error("Nodemailer Error:", error);
    }
}
module.exports = { sendMail };