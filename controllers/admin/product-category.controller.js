const ProductCategory = require("../../models/product-category.model.js")
const systemConfig = require("../../config/system.js")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = +count + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }

    // // if (req.file) {
    // //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // // }
    const records = await ProductCategory.create(req.body)

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};