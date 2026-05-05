
const { sendMail } = require("./sendGrid.js")




const sendWelcomeMail = async (user) => {
    await sendMail(
        {

            to: user.email,
            subject: "Welcome to our store",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">Welcome ${user.name} to our store</h2>
            <p style="color: #444;">Thank you for joining our store</p>
            <p style="color: #444;">You can now login to your account</p>
            <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background-color: #111827; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login</a>
        </div>
        
        `
        }
    )
}

module.exports = {
    sendWelcomeMail
}