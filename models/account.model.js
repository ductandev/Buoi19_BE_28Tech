const mongoose = require("mongoose")
const generate = require("../helpers/generate.js")

const accounttSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
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
const Account = mongoose.model("Account", accounttSchema, "accounts");

module.exports = Account;
