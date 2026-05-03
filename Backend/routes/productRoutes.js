const express = require("express");
const router = express.Router()
const { verifyAdmin } = require("../middlewares/verifyUser.js")
const upload = require("../config/multer.js")
const { validate } = require("../middlewares/validate.js")
const { productSchema } = require("../shared/ProductSchema.js")

const { getProducts, getProductById, updateProduct, deleteProduct, createProduct } = require("../controller/product.js");
const parseFormData = (req, res, next) => {
  try {
    if (req.body.category && typeof req.body.category === "string") {
      req.body.category = JSON.parse(req.body.category);
    }

    if (req.body.variants && typeof req.body.variants === "string") {
      req.body.variants = JSON.parse(req.body.variants);
    }


    if (req.body.basePrice) {
      req.body.basePrice = Number(req.body.basePrice);
    }

    if (req.body.isFeatured) {
      req.body.isFeatured = req.body.isFeatured === "true";
    }
    if (req.body.keyFeatures && typeof req.body.keyFeatures === "string") {
      req.body.keyFeatures = JSON.parse(req.body.keyFeatures);
    }
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }

    if (req.body.stock) {
      req.body.stock = Number(req.body.stock);
    }

    if (req.body.discount) {
      req.body.discount = Number(req.body.discount);
    }

    if (req.body.featured) {
      req.body.featured = req.body.featured === "true";
    }

    if (req.body.isActive) {
      req.body.isActive = req.body.isActive === "true";
    }

    if (req.body.deleteImages && typeof req.body.deleteImages === "string") {
      req.body.deleteImages = JSON.parse(req.body.deleteImages);
    }

    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON in form data",
    });
  }
};
router.get("/", getProducts);




router.get("/:id", getProductById);


router.post("/", verifyAdmin, upload.any(), parseFormData, validate(productSchema), createProduct);


router.put("/:id", verifyAdmin, upload.any(), parseFormData, validate(productSchema), updateProduct);

router.delete("/:id", verifyAdmin, deleteProduct)

module.exports = router