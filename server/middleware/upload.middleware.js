const multer = require("multer")

const storage = multer.diskStorage({
	destination: (req, file, cb) => { //! путь, куда сохраняем картинки
		cb(null, "uploads/")
	},
	filename: (req, file, cb) => { //! как будет называться наш файл
		cb(null, file.originalname)
	}
})

const types = ["image/png", "image/jpg", "image/jpeg"]

const fileFilter = (req, file, cb) => {
	if (types.includes(file.mimetype)) { //! если у картинки есть поле mimetype, то она будет загружаться на сервер (т.е. если это - картинка)
		cb(null, true)
	} else {
		cb(null, false)
	}
}

module.exports = multer({storage, fileFilter})