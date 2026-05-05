const { sendMail } = require("./resend.js")

const orderConfirmedMail = async (user, order) => {
    await sendMail({
        to: user.email,
        subject: "Order Confirmed",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">Order Confirmed ${user.name}</h2>
            <p style="color: #444;">Thank you for your order</p>
            <p style="color: #444;">Your order has been confirmed</p>
            <p style="color: #444;">Order ID: ${order._id}</p>
            <p style="color: #444;">Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p style="color: #444;">Order Total: ₹${order.totalPrice}</p>

            <ul style="list-style-type: none; padding: 0;">
                ${order.items.map(item => `
                    <li style="margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                        <p style="color: #444;">Product Name: ${item.title}</p>
                        <p style="color: #444;">Variant: ${item.variantLabel}</p>
                        <p style="color: #444;">Quantity: ${item.quantity}</p>
                        <p style="color: #444;">Price: ₹${item.price}</p>
                    </li>
                `).join("")}
            </ul>

            <p style="color: #444;">Items will be delivered to: ${user.address}</p>
            <p style="color: #444;">Estimated delivery: 5-7 business days</p>

            <a href="http://localhost:5173/login"
               style="display: inline-block; padding: 10px 20px; background-color: #111827; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
               Login
            </a>
        </div>`
    })
}

module.exports = { orderConfirmedMail }