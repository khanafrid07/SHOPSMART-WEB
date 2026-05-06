const Review = require("../models/review.js")
const Product = require("../models/product.js")
const User = require("../models/user.js")

const createReview = async (req, res) => {
    try {
        let { rating, comment, productId } = req.body
        console.log(req.body, "review")
        const reviewedUser = await User.findById(req.userId)
        productId = productId.split("-").pop()
        let reviewProduct = await Product.findById(productId)
        let review = new Review({ username: reviewedUser.name, rating, comment })
        reviewProduct.reviews.push(review._id)
        await review.save()
        await reviewProduct.save()
        res.status(200).json({ message: "Review Added Successful", review })

    } catch (err) {
        res.status(500).json({ message: "Failed to add Review", error: err.message })
    }


}

module.exports = { createReview }