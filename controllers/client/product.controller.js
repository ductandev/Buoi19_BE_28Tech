const Product = require("../../models/product.model.js")
const ProductCategory = require("../../models/product-category.model.js")

const productsHelper = require("../../helpers/product.js")
const productsCategorysHelper = require("../../helpers/products-category.js")


// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" })

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };

    const product = await Product.findOne(find)

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
}


// ⭐⭐⭐⭐⭐[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  })

  // const getSubCategory = async (parentId) => {
  //   const subs = await ProductCategory.find({
  //     parent_id: parentId,
  //     status: "active",
  //     deleted: false
  //   })

  //   let allSub = [...subs];	// Tạo biến allSub để thêm các phần tử con cho các vòng mà nó lặp qua.

  //   for (const sub of subs) {
  //     const childs = await getSubCategory(sub.id);
  //     allSub = allSub.concat(childs);
  //   }

  //   return allSub;
  // }

  // const listSubCategory = await getSubCategory(category.id);

  const listSubCategory = await productsCategorysHelper.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);


  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({ position: "desc" })

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts
  })
}