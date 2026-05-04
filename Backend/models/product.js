const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  attributes: {
    type: Object, // flexible for all product types
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  images: [
    {
      url: String,
      fileName: String,
      public_id: String,
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      main: String,
      sub: String,
      gender: String,
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    discount: {
      type: Number,
      default: 0,
    },


    images: [
      {
        url: { type: String, required: true },
        isMain: { type: Boolean, default: false },
        fileName: String,
        public_id: String,
      },
    ],

    variants: [variantSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    soldCount: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },

  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", "category.main": "text", "category.sub": "text", "category.gender": "text" });
module.exports = mongoose.model("Product", productSchema);