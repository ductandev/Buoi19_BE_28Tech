const express = require("express")
const router = express.Router();


const controller = require("../../controllers/admin/auth.controller.js")
const validate = require("../../validates/admin/auth.validate.js")

router.get("/login", controller.login)

router.post("/login", validate.loginPost, controller.loginPost)

// router.post("/login", controller.createPost)

// router.get("/edit/:id", controller.edit)

// router.patch("/edit/:id", controller.editPatch)

// router.get("/permissions", controller.permissions)

// router.patch("/permissions", controller.permissionPatch)

module.exports = router;