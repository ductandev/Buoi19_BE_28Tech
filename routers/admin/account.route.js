const express = require("express")
const router = express.Router();
const multer = require('multer')
const upload = multer()

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validates/admin/account.validate.js")


const controller = require("../../controllers/admin/account.controller.js")

router.get("/", controller.index)

router.get("/create", controller.create)

router.post(
    "/create",
    upload.single('avatar'),
    // ============== CLOUDINARY ============
    uploadCloud.upload,
    // ====================================== 
    controller.createPost)

// router.get("/edit/:id", controller.edit)

// router.patch("/edit/:id", controller.editPatch)

// router.get("/permissions", controller.permissions)

// router.patch("/permissions", controller.permissionPatch)

module.exports = router;