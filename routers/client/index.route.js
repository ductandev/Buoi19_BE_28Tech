const homeRouters = require("./home.route.js")
const productRouter = require("./product.route.js")

module.exports = (app) => {
    app.use("/", homeRouters);

    app.use("/products", productRouter)

}