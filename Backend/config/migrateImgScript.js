
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Banner = require("../models/banner");
const cloudinary = require("./cloudinary");
console.log(process.env.MONGO_URL, process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET)

mongoose.connect(process.env.MONGO_URL);

// async function migrateBannerImg() {
//     try {
//         const banners = await Banner.find();

//         for (let banner of banners) {
//             if (!banner.image) continue;

//             // extract local file if needed
//             const imagePath = banner.image.toString();
//             console.log(banner.image, "img banenr")
//             let localPath = imagePath;

//             // if already cloudinary skip
//             if (imagePath.includes("cloudinary")) continue;

//             // if it's URL from backend uploads
//             if (imagePath.includes("/uploads/")) {
//                 const filename = path.basename(imagePath);
//                 localPath = path.join(__dirname, "../uploads", filename);
//             }

//             if (!fs.existsSync(localPath)) {
//                 console.log("❌ File not found:", localPath);
//                 continue;
//             }

//             const result = await cloudinary.uploader.upload(localPath, {
//                 folder: "banners",
//             });

//             banner.image = {
//                 url: result.secure_url,
//                 public_id: result.public_id,
//             };

//             await banner.save();

//             console.log("✅ Migrated:", result.secure_url);
//         }

//         console.log("🎉 Banner migration completed");
//         process.exit();
//     } catch (err) {
//         console.error("Migration error:", err);
//         process.exit(1);
//     }
// }

// migrateBannerImg();


const Product = require("../models/product");

async function updateImages() {
    const products = await Product.find();

    for (let product of products) {
        product.images = product.images.map(img => ({
            url: img.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_800/"
            ),
            isMain: img.isMain
        }));

        await product.save();
    }

    console.log("Images updated");
}

updateImages();