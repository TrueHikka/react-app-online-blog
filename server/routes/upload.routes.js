const express = require("express")
const router = express.Router({mergeParams: true})
// const checkAuth = require("../middleware/auth.middleware")
const fileMiddleware = require("../middleware/upload.middleware")

router.post("/",  fileMiddleware.single("image"), (req, res) => {
	try {
		if(req.file) {
			// res.json({
			// 	url: `/upload/${req.file.originalname}`
			// })
			res.json(req.file)
		}
	} catch (error) {
		res.status(500).json({
			message: "На сервере произошла ошибка. Попробуйте позже"
		})
	}
})

module.exports = router