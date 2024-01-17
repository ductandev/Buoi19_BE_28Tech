var md5 = require('md5');
const Account = require("../../models/account.model.js")
const Role = require("../../models/roles.model.js")
const systemConfig = require("../../config/system.js")


// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    } else {
        res.render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập",
        })
    }
}


// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await Account.findOne({
        email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email không tồn tại !")
        res.redirect("back")
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Sai mật khẩu !")
        res.redirect("back")
        return;
    }

    if (user.status == "inactive") {
        req.flash("error", " tài khoản đã bị khóa!")
        res.redirect("back")
        return;
    }

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}