const mongoose = require("mongoose")


const roleSchema = new mongoose.Schema(
  {
    title: String,        // Sản phẩm 1
    description: String,
    permissions: {          // nhomQuyen
      type: Array,
      default: []
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
const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
