const express = require("express")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const router = express.Router({mergeParams: true})
const UserModel = require("../models/User")
const tokenService = require("../services/token.service")
const { registerValidation, authValidation } = require("../utils/validation")
const checkAuth = require("../middleware/auth.middleware")

router.get("/me", checkAuth, async (req, res) => {
	try {
	  const user = await UserModel.findById(req.user);
	  
	  if (!user) {
		return res.status(404).json({
		  message: 'Пользователь не найден',
		});
	  }
  
	  const { passwordHash, ...userData } = user._doc;
  
	  res.json(userData);
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Нет доступа',
	  });
	}
  });

router.post("/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(400).json({
				error: {
					message: "INVALID_DATA",
					code: 400,
					errors: errors.array()
				}
			})
		}
		// console.log(req.body)
		
		const {email, password} = req.body

		const existingUser = await UserModel.findOne({ email })

		if (existingUser) {
			return res.status(400).json({
			error: {
				message: 'EMAIL_EXISTS',
				code: 400,
				errors: errors.array()
			}
			})
		}

		const hash = await bcrypt.hash(password, 12)

		const newUser = await UserModel.create({
			...req.body,
			passwordHash: hash
		})

		const tokens = tokenService.generate({_id: newUser._id})
		await tokenService.save(newUser._id, tokens.refreshToken)
		console.log(tokens)
		res.status(201).send({...tokens, userId: newUser._id})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось зарегестрироваться'
		})
	}
})

router.post("/login", authValidation, async (req, res) => {
	try {
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(400).json({
				error: {
					message: "INVALID_DATA",
					code: 400
				}
			})
		}
		// console.log(req.body)
		const {email, password} = req.body

		const existingUser = await UserModel.findOne({email})
		if (!existingUser) {
			return res.status(400).json({
				error: {
					message: 'USER_NOT_FOUND',
					code: 400,
					errors: errors.array()
				}
			})
		}

		const isPasswordEqual = await bcrypt.compare(password, existingUser.passwordHash)

		if(!isPasswordEqual) {
			return res.status(400).send({
				error: {
					message: 'INVALID_EMAIL_OR_PASSWORD',
					code: 400,
					errors: errors.array()
				}
			})
		}

		const tokens = tokenService.generate({_id: existingUser._id})
		await tokenService.save(existingUser._id, tokens.refreshToken)
		
		res.status(200).send({...tokens, userId: existingUser._id})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось авторизоваться'
		})
	}
})

// router.post("/tokens", async (req, res) => {
// 	try {
// 		const {refresh_token: refreshToken} = req.body
// 		// console.log(req.body)
// 		const data = tokenService.validateRefresh(refreshToken)
// 		// console.log(data)
// 		const dbToken = await tokenService.findToken(refreshToken)
// 		// console.log(dbToken)
// 		function isTokenInvalid(data, dbToken) {
// 			return !data || !dbToken || data._id !== dbToken?.user?.toString()
// 		}

// 		if(isTokenInvalid(data, dbToken)) {
// 			return res.status(401).json({message: "Unauthorized"})
// 		}

// 		const tokens = tokenService.generate({
// 			_id: data._id
// 		})

// 		await tokenService.save(data._id, tokens.refreshToken)

// 		res.status(200).send({...tokens, userId: data._id})
// 	} catch (error) {
// 		res.status(500).json({
// 			message: 'Нет доступа'
// 		})
// 	}
// })


module.exports = router