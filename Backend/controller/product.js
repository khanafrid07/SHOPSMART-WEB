const multer = require("multer")
const { generateSKU } = require("../utils/skuGenerator.js");
const fs = require("fs")
const cloudinary = require("../config/cloudinary.js");
const Product = require("../models/product.js")
const getProducts = async (req, res) => {
    try {
        const {
            sort,
            limit,
            category,
            categories,
            sub,
            type,
            gender,
            search,
            discount
        } = req.query;

        const capitalize = (str) => {
            if (!str) return null;
            return str.charAt(0).toUpperCase() + str.slice(1);
        };


        const isValid = (val) =>
            val !== undefined &&
            val !== null &&
            val !== "" &&
            val !== "null" &&
            val !== "undefined";

        let filter = {};

        if (isValid(search)) {
            const normalizedSearch = search.split("").join("[-\\s]*");

            filter.$or = [
                {
                    title: {
                        $regex: normalizedSearch,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: normalizedSearch,
                        $options: "i",
                    },
                },
                {
                    "category.main": {
                        $regex: normalizedSearch,
                        $options: "i",
                    },
                },
                {
                    "category.sub": {
                        $regex: normalizedSearch,
                        $options: "i",
                    },
                },
            ];
        }
        if (isValid(categories)) {
            const allCategories = categories.split(",");
            const catArray = allCategories.map(capitalize);

            filter["category.main"] = { $in: catArray };
        }

        else if (isValid(category)) {
            filter["category.main"] = { $regex: `^${category}$`, $options: "i" };
        }


        if (isValid(sub)) {
            filter["category.sub"] = { $regex: `^${sub}$`, $options: "i" };
        }

        if (isValid(type)) {
            filter["category.sub"] = { $regex: `^${type}$`, $options: "i" };
        }


        if (isValid(gender)) {
            filter["category.gender"] = { $regex: `^${gender}$`, $options: "i" };
        }

        (filter, "filter")
        if (sort === "featured") {
            filter.isFeatured = true;
        }
        if (discount) {
            filter.discount = { $gt: Number(discount) };
        }
        let sortQuery = {};
        if (sort === "trending") sortQuery = { soldCount: -1 };
        else if (sort === "newest") sortQuery = { createdAt: -1 };
        else if (sort === "priceLow") sortQuery = { basePrice: 1 };
        else if (sort === "priceHigh") sortQuery = { basePrice: -1 };

        const allProducts = await Product.find(filter)
            .sort(sortQuery)
            .limit(Number(limit));

        if (!allProducts.length) {
            return res.status(200).json({ allProducts: [] });
        }
        return res.status(200).json({ allProducts });

    } catch (err) {
        return res.status(500).json({
            message: "ERROR FETCHING PRODUCTS",
            error: err.message,
        });
    }
}

const getProductById = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.split("-").pop();
        const product = await Product.findById(id).populate("reviews");
        if (!product) return res.status(404).json({ message: "Product Not Found!", error: err.message });
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: "Error fetching product", error: err.message });
    }
}


const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            variants,
            keyFeatures,
            featured,
            slug,
            stock,
            isFeatured,
            tags,
        } = req.body;

        const files = req.files || [];

        // ---------------- MAIN IMAGE ----------------
        const mainImg = files.find(
            (f) => f.fieldname === "mainImage"
        );

        const otherImages = files.filter(
            (f) => f.fieldname === "images"
        );

        let uploadedImage = [];


        const uploadToCloudinary = async (file, folder) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
            });

            fs.unlink(file.path, () => { }); // non-blocking delete

            return result;
        };

        // MAIN IMAGE
        if (mainImg) {
            const result = await uploadToCloudinary(mainImg, "products");

            uploadedImage.push({
                url: result.secure_url,
                public_id: result.public_id,
                isMain: true,
            });
        }

        // OTHER IMAGES
        for (let file of otherImages) {
            try {
                const result = await uploadToCloudinary(file, "products");

                uploadedImage.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    isMain: false,
                });
            } catch (err) {
                console.log("Image upload failed:", err.message);
            }
        }

        // fallback main image
        if (uploadedImage.length > 0) {
            const hasMain = uploadedImage.some((img) => img.isMain);
            if (!hasMain) uploadedImage[0].isMain = true;
        }

        // ---------------- VARIANTS ----------------
        const variantImages = files.filter((f) =>
            f.fieldname.startsWith("variantImages_")
        );

        const parsedVariants =
            typeof variants === "string"
                ? JSON.parse(variants)
                : variants;

        for (let i = 0; i < parsedVariants.length; i++) {
            const variant = parsedVariants[i];

            const group = variantImages.filter(
                (f) => f.fieldname === `variantImages_${i}`
            );

            variant.images = [];

            for (let file of group) {
                try {
                    const result = await uploadToCloudinary(
                        file,
                        "products/variants"
                    );

                    variant.images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                } catch (err) {
                    console.log("Variant upload failed:", err.message);
                }
            }

            variant.sku = generateSKU({
                title,
                variant: variant.attributes,
            });
        }


        const baseVariant = parsedVariants?.[0];

        if (!baseVariant) {
            return res.status(400).json({
                message: "At least one variant is required",
            });
        }

        const lowestPriceVariant = parsedVariants.reduce(
            (min, v) => (v.price < min.price ? v : min),
            parsedVariants[0]
        );

        const finalPrice =
            lowestPriceVariant.price -
            (lowestPriceVariant.price *
                lowestPriceVariant.discount) /
            100;

        const newProduct = new Product({
            title,
            description,
            basePrice: finalPrice,
            discount: lowestPriceVariant.discount,
            category,
            variants: parsedVariants,
            featured,
            slug,
            stock,
            keyFeatures,
            isFeatured,
            tags,
            images: uploadedImage,
        });

        await newProduct.save();

        return res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (err) {
        console.error("PRODUCT ERROR:", err);

        return res.status(500).json({
            message: "Error creating product",
            error: err.message,
        });
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { title, description, category, variants, slug, stock, keyFeatures, isFeatured, tags, deleteImages, } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const uploadToCloudinary = async (file, folder) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
            });

            fs.unlink(file.path, () => { });

            return result;
        };


        const files = req.files || [];

        const parsedVariants =
            typeof variants === "string"
                ? JSON.parse(variants)
                : variants || [];

        const imagesToDelete = Array.isArray(deleteImages)
            ? deleteImages
            : deleteImages
                ? [deleteImages]
                : [];

        let updatedImages = product.images.filter(
            (img) => !imagesToDelete.includes(img.url)
        );
        for (let url of imagesToDelete) {
            const img = product.images.find((i) => i.url === url);
            if (img?.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        // ---------------- UPLOAD NEW IMAGES ----------------
        const images = files.filter((f) => f.fieldname === "images");

        for (let file of images) {
            const result = await uploadToCloudinary(file, "products");

            updatedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
                isMain: false,
            });


        }

        // ---------------- MAIN IMAGE ----------------
        const mainImage = files.find(
            (f) => f.fieldname === "mainImage"
        );

        if (mainImage) {
            const result = await uploadToCloudinary(mainImage, "products");

            updatedImages = updatedImages.map((img) => ({
                ...img,
                isMain: false,
            }));

            updatedImages.unshift({
                url: result.secure_url,
                public_id: result.public_id,
                isMain: true,
            });
        }

        // fallback main image
        if (updatedImages.length > 0) {
            const hasMain = updatedImages.some((i) => i.isMain);
            if (!hasMain) updatedImages[0].isMain = true;
        }

        // ---------------- VARIANT IMAGES ----------------
        const variantImages = files.filter((f) =>
            f.fieldname.startsWith("variantImages_")
        );

        for (let i = 0; i < parsedVariants.length; i++) {
            const variant = parsedVariants[i];

            const group = variantImages.filter(
                (f) => f.fieldname === `variantImages_${i}`
            );

            variant.images = variant.images || [];

            for (let file of group) {
                const result = await uploadToCloudinary(file, "products/variants");

                variant.images.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });


            }

            if (!variant.sku) {
                variant.sku = generateSKU({
                    title,
                    variant: variant.attributes,
                });
            }
        }

        // ---------------- PRICE CALCULATION ----------------
        const lowestPriceVariant = parsedVariants.reduce(
            (min, v) => (v.price < min.price ? v : min),
            parsedVariants[0]
        );

        const finalPrice =
            lowestPriceVariant.price -
            (lowestPriceVariant.price *
                lowestPriceVariant.discount) /
            100;


        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                title,
                description,
                basePrice: finalPrice,
                discount: lowestPriceVariant.discount,
                category,
                variants: parsedVariants,
                isFeatured,
                keyFeatures,
                slug,
                tags,
                stock: Number(stock),
                images: updatedImages,
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (err) {
        console.error("UPDATE ERROR:", err);

        return res.status(500).json({
            message: "Error updating product",
            error: err.message,
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({ message: "Product deleted successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Error deleting Product", error: err.message })
    }
}

module.exports = { createProduct, updateProduct, deleteProduct, getProductById, getProducts }
