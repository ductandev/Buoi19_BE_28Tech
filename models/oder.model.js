const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullname: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ]

    },
    { timestamps: true }
);

// Tham số thứ 3: products là tên của connection trong database
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
