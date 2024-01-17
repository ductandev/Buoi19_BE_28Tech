const Account = require("../../models/account.model.js")
const systemConfig = require("../../config/system.js")


module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    } else {
        console.log(req.cookies.token)
        const user = await Account.findOne({ token: req.cookies.token })

        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        } else {
            console.log("🚀 ~ module.exports.requireAuth= ~ user:", user)
            next();
        }
    }
}