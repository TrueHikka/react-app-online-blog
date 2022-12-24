const express = require("express")
const router = express.Router({mergeParams: true})
const PostModel = require("../models/Post")
const { postCreateValidation } = require("../utils/validation")
const checkAuth = require("../middleware/auth.middleware")
const { validationResult } = require("express-validator")

router.get("/tags",  async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec() //todo
		const tags = posts.map(post => post.tags).flat().slice(0, 5)
		res.status(200).json(tags)
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить теги"
		})
	}
	
})

router.get("/comments/:id",  async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
})

router.get("/",  async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec() //todo
		res.status(200).json(posts)
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить статьи"
		})
	}
	
})

router.get("/:postId",  async (req, res) => {
	try {
		const artId = req.params.postId

		PostModel.findByIdAndUpdate({ //todo
				_id: artId
			}, {
				$inc: {viewsCount: 1}
			}, {
				returnDocument: "after"
			}, 
			(err, doc) => {
				if(err) {
					console.log(err)
					return res.status(500).json({
						message: "Не удалось вернуть статью"
					})
				}

				if(!doc) {
					return res.status(404).json({
						message: "Статья не найдена"
					})
				}

				res.status(200).json(doc)
			}
		).populate("user")
	} catch (error) {
		res.status(500).json({
			message: "На сервере произошла ошибка. Попробуйте позже"
		})
	}
	
})

router.post("/", checkAuth, postCreateValidation, async (req, res) => {
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
		const newpost = await PostModel.create({
			...req.body,
			user: req.user
		})
		await newpost.save()
		res.status(200).send(newpost)
	} catch (error) {
		res.status(500).json({
			message: "Не удалось создать статью",
		})
	}
	
})

router.patch("/:postId", checkAuth, postCreateValidation, async (req, res) => {
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

		const {postId} = req.params
	
		const updatepost = await PostModel.findByIdAndUpdate(
			{
				_id: postId
			}, 
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				user: req.user
			}
		)
		console.log(updatepost)
		res.status(200).send(updatepost)
	} catch (error) {
		res.status(500).json({
			message: "Не удалось обновить статью"
		})
	}
	
})

router.delete("/:postId", checkAuth, async (req, res) => {
	try {
		const artId = req.params.postId

		PostModel.findByIdAndDelete({
			_id: artId
		}, 
			(err, doc) => {
			if(err) {
				console.log(err)
				return res.status(500).json({
					message: "Не удалось удалить статью"
				})
			}

			if(!doc) {
				return res.status(404).json({
					message: "Статья не найдена"
				})
			}

			res.status(200).json({
				success: true
			})
		})
	} catch (error) {
		res.status(500).json({
			message: "На сервере произошла ошибка. Попробуйте позже"
		})
	}
	
})

module.exports = router