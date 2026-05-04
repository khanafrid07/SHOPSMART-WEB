const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      trim: true,
    },
    heading: {
      type: String,
      trim: true,
    },
    subHeading: {
      type: String,
      trim: true,
    },


    image: {
      url: String,
      public_id: String,
      fileName: String
    },

    ctaText: {
      type: String,
      trim: true,
    },
    ctaLink: {
      type: String,
      trim: true,
    },


    type: {
      type: String,
      enum: ["hero", "promo", "category"],
      required: true,
    },

    placement: {
      type: String,
      enum: ["home_top", "home_middle", "home_bottom"],
    },

    category: String,


    template: {
      type: String,
      enum: [
        "clean_image",
        "split_banner",
        "hero_dark",
        "center_minimal",
        "left_overlay",
        "gradient_promo"
      ],
      required: true,
      default: "clean_image"
    },

    priority: {
      type: Number,
      default: 0,
    },

    startDate: Date,
    endDate: Date,


    isActive: {
      type: Boolean,
      default: true,
    },
    schedule: {
      startDate: Date,
      endDate: Date,
    }


  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);