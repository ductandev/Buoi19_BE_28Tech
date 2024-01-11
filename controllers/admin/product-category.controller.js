const ProductCategory = require("../../models/product-category.model.js")
const systemConfig = require("../../config/system.js")
const createTreeHelper = require("../../helpers/createTree.js")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    // // ĐỆ QUY (RECURSION TREE)
    // function createTree(arr, parentId = "") {
    //     const tree = [];
    //     arr.forEach((item) => {
    //         if (item.parent_id === parentId) {
    //             // console.log("⭐⭐⭐⭐⭐ PASS")
    //             const newItem = item;
    //             const children = createTree(arr, item.id)       // khi bạn sử dụng "item.id" trong mã của bạn, Mongoose hiểu rằng bạn đang muốn truy cập trường _id và tự động chuyển đổi nó thành dạng chuỗi nếu cần thiết.
    //             if (children.length > 0) {
    //                 newItem.children = children;
    //             }
    //             tree.push(newItem);
    //         }
    //     });
    //     return tree;
    // }

    const records = await ProductCategory.find(find);

    // const newRecords = createTree(records)           // Đệ quy chưa tách file
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    // // ĐỆ QUY (RECURSION TREE)
    // function createTree(arr, parentId = "") {
    //     const tree = [];
    //     arr.forEach((item) => {
    //         // console.log("🚀 ~ file: product-category.controller.js:27 ~ arr.forEach ~ item:", item)
    //         if (item.parent_id === parentId) {
    //             // console.log("⭐⭐⭐⭐⭐ PASS")
    //             const newItem = item;
    //             const children = createTree(arr, item.id)       // khi bạn sử dụng "item.id" trong mã của bạn, Mongoose hiểu rằng bạn đang muốn truy cập trường _id và tự động chuyển đổi nó thành dạng chuỗi nếu cần thiết.
    //             if (children.length > 0) {
    //                 newItem.children = children;
    //             }
    //             tree.push(newItem);
    //         }
    //     });
    //     return tree;
    // }

    const records = await ProductCategory.find(find)

    // const newRecords = createTree(records)           // Đệ quy chưa tách file
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
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