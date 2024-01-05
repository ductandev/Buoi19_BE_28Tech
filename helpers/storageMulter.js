const multer = require('multer')

module.exports = () => {
    const storage = multer.diskStorage({
        destination: process.cwd() + "/public/uploads/",
        filename: function (req, file, callback) {
            callback(null, new Date().getTime() + "_" + file.originalname);
        }
    })

    return storage;
}