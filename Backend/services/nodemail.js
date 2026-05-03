const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (options) => {
    (process.env.EMAIL_USER, process.env.EMAIL_PASS);
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
    catch (error) {
        (error);
    }
}
module.exports = { sendMail };