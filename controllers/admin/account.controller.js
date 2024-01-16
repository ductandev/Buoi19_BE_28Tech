var md5 = require('md5');
const Account = require("../../models/account.model.js")
const Role = require("../../models/roles.model.js")
const systemConfig = require("../../config/system.js")


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Account.find(find).select("-password -token") // Lấy tất cả nhưng trừ password và token

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

// // [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })

    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo mới tài khoản",
        roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExist) {
        req.flash("error", `Email ${emailExist} đã tồn tại!`)
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password)

        const records = await Account.create(req.body)

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// // [GET] /admin/accounts/edit/:id
// module.exports.edit = async (req, res) => {
//     try {
//         const data = await Account.findOne({
//             _id: req.params.id,
//             deleted: false
//         })

//         res.render("admin/pages/accounts/edit.pug", {
//             pageTitle: "Sửa nhóm quyền",
//             data: data
//         });
//     } catch (error) {
//         res.redirect(`${systemConfig.prefixAdmin}/accounts`)
//     }
// }

// // [PATCH] /admin/accounts/edit/:id
// module.exports.editPatch = async (req, res) => {
//     try {
//         const data = await Account.updateOne({
//             _id: req.params.id,
//             deleted: false
//         }, req.body)

//         req.flash("success", "Cập nhật nhóm quyền thành công!")
//         res.redirect(`back`)

//     } catch (error) {
//         req.flash("error", "Cập nhật nhóm quyền thất bại!")
//         res.redirect(`${systemConfig.prefixAdmin}/accounts`)

//     }
// }


// // [GET] /admin/accounts/permissions
// module.exports.permissions = async (req, res) => {
//     try {
//         const records = await Account.find({
//             deleted: false
//         })

//         res.render("admin/pages/accounts/permissions.pug", {
//             pageTitle: "Phân quyền",
//             records: records
//         });

//     } catch (error) {
//         console.log("🚀 ~ file: role.controller.js:84 ~ module.exports.permissions= ~ error:", error)
//         req.flash("error", "Tải dữ liệu phân quyền thất bại!")
//         res.redirect(`${systemConfig.prefixAdmin}/accounts`)

//     }
// }

// // [PATCH] /admin/accounts/permissions
// module.exports.permissionPatch = async (req, res) => {
//     try {
//         const permissions = JSON.parse(req.body.permissions);

//         for (const item of permissions) {
//             await Account.updateOne({ _id: item.id }, { permissions: item.permissions })
//         }

//         req.flash("success", "Cập nhật phân quyền thành công!")
//         res.redirect("back")

//     } catch (error) {
//         req.flash("error", "Phân quyền thất bại!")
//         res.redirect(`${systemConfig.prefixAdmin}/accounts`)
//     }
// }

