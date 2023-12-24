const Product = require("../../models/product.model.js")

const filterStatusHelper = require("../../helpers/filterStatus.js")
const paginationHelper = require("../../helpers/pagination.js")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    console.log(req.query.status)

    // Phần bộ lọc trạng thái status
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status          // Thêm 1 key vào object
    }

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        find.title = new RegExp(keyword, "i");       // ⭐regex
    }


    // Pagination
    const countProduct = await Product.countDocuments(find);

    let objectPanigation = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countProduct
    )

    // if (req.query.page) {
    //     objectPanigation.currentPage = parseInt(req.query.page);
    // }
    // objectPanigation.skip = (objectPanigation.currentPage - 1) * objectPanigation.limitItems;

    // const countProduct = await Product.countDocuments(find);
    // const totalPage = Math.ceil(countProduct / objectPanigation.limitItems);
    // objectPanigation.totalPage = totalPage;
    // End Pagination



    const products = await Product.find(find).limit(objectPanigation.limitItems).skip(objectPanigation.skip);
    // console.log(products)


    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: objectPanigation
    });
}