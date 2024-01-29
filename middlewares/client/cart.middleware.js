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
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })

        if (cart) {
            // Kiểm tra xem cart không phải là null trước khi thực hiện các thao tác khác
            cart.totalQuantity = cart.products ? cart.products.reduce((sum, item) => sum + item.quantity, 0) : 0;
        } else {
            // Xử lý khi cart là null
            console.error("Error in cartId middleware: Cart is null");
            res.status(500).send("Internal Server Error");
            return;
        }

        res.locals.miniCart = cart;

    }

    next();
}



// const Cart = require("../../models/cart.model.js");

// module.exports.cardId = async (req, res, next) => {
//     try {
//         if (!req.cookies.cartId) {
//             const cart = new Cart();
//             await cart.save();

//             const expiresTime = 1000 * 60 * 60 * 24 * 365;

//             res.cookie("cartId", cart.id, {
//                 expires: new Date(Date.now() + expiresTime)
//             });
//         } else {
//             const cart = await Cart.findOne({
//                 _id: req.cookies.cartId
//             });

//             if (cart && cart.products) {
//                 cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
//             } else {
//                 cart.totalQuantity = 0; // hoặc giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
//             }

//             res.locals.miniCart = cart;
//         }
//     } catch (error) {
//         // Xử lý lỗi ở đây, ví dụ:
//         console.error("Error in cartId middleware:", error);
//         res.status(500).send("Internal Server Error");
//         return; // Ngăn chặn lỗi Unhandled Promise Rejection
//     }

//     next();
// };
