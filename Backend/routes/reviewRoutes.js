const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyUser.js")
const { validate } = require("../middlewares/validate.js")
const { reviewSchema } = require("../../Shared/Schema/reviewSchema.js");
const { createReview } = require("../controller/review.js");

router.post("/", verifyToken, validate(reviewSchema), createReview)


module.exports = router