const Product = require("../../models/product.model.js")
const productsHelper = require("../../helpers/product.js")

// [GET] /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProducts = [];

    if (keyword) {
        const keywordRegex = new RegExp(keyword, "i");     // "i" : Không phân biệt chữ ho ahay thuơ
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        newProducts = productsHelper.priceNewProducts(products)
        console.log(products)
    }


    res.render("client/pages/search/index.pug", {
        pageTitle: "Kết quả tìm kiếm",
        keyword,
        products: newProducts
    });
}