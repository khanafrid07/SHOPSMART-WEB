const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (options) => {
    try {
        const msg = {
            to: options.to,
            from: process.env.EMAIL_USER,
            subject: options.subject,
            html: options.html,
        };
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("SendGrid Error:", err);
        if (err.response) {
            console.error("Response Body:", err.response.body);
        }
    }
};

module.exports = { sendMail };