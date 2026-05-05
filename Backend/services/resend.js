const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (options) => {
    console.log("Attempting to send email via Resend to:", options.to);
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return;
        }

        console.log("Email sent successfully. ID:", data?.id);
    } catch (err) {
        console.error("Resend Exception:", err.message);
    }
};

module.exports = { sendMail };