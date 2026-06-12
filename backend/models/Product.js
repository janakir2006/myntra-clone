const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,

    brand: String,

    price: {
      type: Number,
      required: true,
    },

    discount: String,

    description: String,

    sizes: [String],

    images: [String],

    category: {
      type: String,
      index: true,
      default: "General",
    },

    popularityScore: {
      type: Number,
      default: 0,
      index: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    isDiscontinued: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, popularityScore: -1 });
ProductSchema.index({ isDiscontinued: 1, popularityScore: -1 });

module.exports = mongoose.model("Product", ProductSchema);