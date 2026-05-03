

const payment_intent = async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "inr"
        })
        res.json({ clientSecret: paymentIntent.client_secret })
    } catch (err) {
        res.status(500).json({ message: err.message || err })
    }
}

module.exports = { payment_intent };
