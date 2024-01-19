var md5 = require('md5');
const Account = require("../../models/account.model.js")
const Role = require("../../models/roles.model.js")
const systemConfig = require("../../config/system.js")

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin cá nhân"
    });
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
}

// [PATCH] /admin/my-account/editPatch
module.exports.editPatch = async (req, res) => {
    try {
        const id = res.locals.user.id

        const emailExist = await Account.findOne({
            _id: { $ne: id }, // $ne: là not equal nghĩa là chỉ lấy những thằng khác, không bằng nó
            email: req.body.email,
            deleted: false
        })

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại!`)
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }

            const data = await Account.updateOne({
                _id: id,
                deleted: false
            }, req.body)

            req.flash("success", "Cập nhật tài khoản thành công!")

        }

        res.redirect(`back`)

    } catch (error) {
        req.flash("error", "Cập nhật tài khoản thất bại!")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}