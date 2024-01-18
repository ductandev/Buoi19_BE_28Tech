const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
  {
    title: String,        // Sản phẩm 1
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",       // Sản phẩm 1
      unique: true
    },
    createBy: {
      account_id: String,
      createAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      default: false      // Mặc định trường  "deleted: false" để hiện sản phẩm
    },
    // deletedAt: Date,
    deleteBy: {
      account_id: String,
      deleteAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ]

  }, {
  timestamps: true
}
);

// Tham số thứ 3: products là tên của connection trong database
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
