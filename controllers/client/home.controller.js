const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/product.js")
// [GET] /
module.exports.index = async (req, res) => {
    // =============Lấy ra sản phẩm nổi bật===================
    const productsFeatured = await Product.find({
        featured: "1",      // 1: nổi bật
        deleted: false,
        status: "active"
    }).limit(6)
    // =======================================================

    // Hàm tính giá discount
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

    // =========== Hiển thị danh sách sản phẩm mới nhất ========
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    // =========================================================





    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}