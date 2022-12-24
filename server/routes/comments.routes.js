const express = require("express")
const router= express.Router({mergeParams: true})
const CommentModel = require("../models/Comments")
const checkAuth = require("../middleware/auth.middleware")
const PostModel = require("../models/Post")

// /api/comment
router.post("/:id", checkAuth, async (req, res) => {
		try {
			const { postId, comment } = req.body

			if (!comment)
				return res.json({ message: 'Комментарий не может быть пустым' })

			const newComment = await CommentModel.create({ comment })
			await newComment.save()

			try {
				await PostModel.findByIdAndUpdate(postId, {
					$push: { comments: newComment._id },
				})
			} catch (error) {
				console.log(error)
			}

			res.json(newComment)
		} catch (error) {
			res.status(500).json({
				message: "На сервере произошла ошибка. Попробуйте позже"
			})
		}
	})

module.exports = router