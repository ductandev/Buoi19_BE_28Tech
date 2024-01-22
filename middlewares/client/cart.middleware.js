const Cart = require("../../models/cart.model.js")

module.exports.cardId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart;
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        })
    } else {
        // Khi đã có giỏ hàng
    }

    next();
}