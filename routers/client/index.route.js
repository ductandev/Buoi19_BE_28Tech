const categoryMiddleware = require("../../middlewares/client/category.middleware.js")

const homeRouters = require("./home.route.js")
const productRouter = require("./product.route.js")
const searchRouter = require("./search.route.js")

module.exports = (app) => {
    app.use(categoryMiddleware.category)    // Sử dụng middleware này cho tất cả các router

    app.use("/", homeRouters);

    app.use("/products", productRouter)
    app.use("/products", productRouter)
    app.use("/search", searchRouter)

}