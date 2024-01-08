const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
    {
        title: String,        // Sản phẩm 1
        parent_id: {
            type: String,
            default: ""      // Mặc định trường  "deleted: false" để hiện sản phẩm
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",       // Sản phẩm 1
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false      // Mặc định trường  "deleted: false" để hiện sản phẩm
        },
        deletedAt: Date
    }, {
    timestamps: true
}
);

// Tham số thứ 3: products là tên của connection trong database
const ProductCategory = mongoose.model("Product-category", productCategorySchema, "products-category");

module.exports = ProductCategory;
