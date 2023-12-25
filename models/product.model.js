const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deletedAt: Date
  }
);

// Tham số thứ 3: products là tên của connection trong database
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
