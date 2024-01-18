const Product = require("../../models/product.model.js")
const ProductCategory = require("../../models/product-category.model.js")
const Account = require("../../models/account.model.js")
const systemConfig = require("../../config/system.js")

const filterStatusHelper = require("../../helpers/filterStatus.js")
const paginationHelper = require("../../helpers/pagination.js")
const createTreeHelper = require("../../helpers/createTree.js")



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

  // sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }
  // end sort

  const products = await Product.find(find)
    // .sort({ position: "asc" })
    .sort(sort)
    .limit(objectPanigation.limitItems)
    .skip(objectPanigation.skip);
  // console.log(products)


  // Lấy ra thông tin người tạo
  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createBy.account_id
    });

    if (user) {
      product.accountFullName = user.fullName;

    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      })

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }



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

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
    });

  req.flash("success", "Cập nhật trạng thái thành công !")

  res.redirect("back")
}


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }


  switch (type) {

    case "active":
      await Product.updateMany({ _id: { $in: ids } }, {
        status: "active",
        $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
      });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
      break;


    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, {
        status: "inactive",
        $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
      });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
      break;


    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          // deletedAt: new Date()
          deleteBy: {
            account_id: res.locals.user.id,
            deleteAt: new Date(),
          }
        });
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm !`)
      break;


    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateMany({ _id: id }, {
          position: position,
          $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
        });
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
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      // deletedAt: new Date(),
      deleteBy: {
        account_id: res.locals.user.id,
        deleteAt: new Date(),
      }

    }
  );

  req.flash("success", `Xóa thành công 1 sản phẩm !`)

  res.redirect("back");
}


// [GET] /admin/products/create
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

  const category = await ProductCategory.find(find)

  // const newRecords = createTree(category)           // Đệ quy chưa tách file
  const newCategory = createTreeHelper.tree(category)

  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory
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

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`
  // }

  req.body.createBy = {
    account_id: res.locals.user.id
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

    const category = await ProductCategory.find({
      deleted: false
    })

    const newCategory = createTreeHelper.tree(category)

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
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

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    req.body.updatedBy = updatedBy;

    const product = await Product.updateOne(
      { _id: req.params.id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
    }
    );
    req.flash("success", `Cập nhật thành công !`)
  } catch (error) {
    req.flash("error", `Cập nhật thất bại !`)
  }
  res.redirect(`back`);
}


// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find)

    console.log(product)

    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
