const mongoose = require("mongoose")


const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [{
            product_id: String,
            quantity: Number
        }]
    }, {
    timestamps: true
}
);

// Tham số thứ 3: products là tên của connection trong database
const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
