const Product = require("../../models/product.model.js")
const systemConfig = require("../../config/system.js")

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
    // .sort({ position: "asc" })
    .sort({ position: "desc" })
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
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm !`)
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateMany({ _id: id }, { position: position });
      }
      req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm !`)
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
  req.flash("success", `Xóa thành công 1 sản phẩm !`)

  res.redirect("back");
}


// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm"
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProduct = await Product.countDocuments();
    req.body.position = +countProduct + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  const product = await Product.create(req.body)

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find)

    console.log(product)

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Edit sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    const product = await Product.updateOne({ _id: req.params.id }, req.body)
    req.flash("success", `Cập nhật thành công !`)
  } catch (error) {
    req.flash("error", `Cập nhật thất bại !`)
  }
  res.redirect(`back`);
}