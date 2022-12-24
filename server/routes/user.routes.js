const express = require("express")
const UserModel = require("../models/User")
const router = express.Router({mergeParams: true})
const checkAuth = require("../middleware/auth.middleware")

router.get("/", checkAuth, async (req, res) => {
	try {
		const list = await UserModel.find()
		console.log(list.map(l => l.passwordHash))
		const user = list.map(l => {
			const {passwordHash, ...userData} = l._doc
			return userData
		})
		// const {passwordHash, ...userData} = list
		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({
			message: "На сервере произошла ошибка. Попробуйте позже"
		})
	}
	
})

router.patch("/:userId", checkAuth, async (req, res) => {
	try {
		const {userId} = req.params
		if(userId === req.user._id) {
			const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {new: true})
			res.send(updatedUser)
		} else {
			res.status(401).json({
				message: "Unauthorized"
			})
		}

	} catch (error) {
		res.status(500).json({
			message: "На сервере произошла ошибка. Попробуйте позже"
		})
	}
	
})

module.exports = router







