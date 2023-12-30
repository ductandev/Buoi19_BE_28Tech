const Product = require("../../models/product.model.js")

const filterStatusHelper = require("../../helpers/filterStatus.js")
const paginationHelper = require("../../helpers/pagination.js")

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status)

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



  const products = await Product.find(find)
    .sort({ position: "asc" })
    .limit(objectPanigation.limitItems)
    .skip(objectPanigation.skip);
  // console.log(products)


  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPanigation
  });
}



// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công !")

  res.redirect("back")
}


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateMany({ _id: id }, { position: position });
      }
      break;

    default:
      break;
  }
  res.redirect("back")
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

  res.redirect("back");
}