const express = require("express")
const router = express.Router()
const upload = require("../config/multer.js");
const wrapAsync = require("../middlewares/wrapAsync.js");
const { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner, updateStatus } = require("../controller/banner.js");


// CREATE new banner
router.post("/", upload.single("image"), wrapAsync(createBanner));

// GET all banners with optional filters
router.get("/", wrapAsync(getAllBanners));

// GET banner by ID
router.get("/:id", wrapAsync(getBannerById));



// UPDATE banner
router.put("/:id", upload.single("image"), wrapAsync(updateBanner));

router.patch("/:id/status", wrapAsync(updateStatus));

router.delete("/:id", wrapAsync(deleteBanner));



module.exports = router
