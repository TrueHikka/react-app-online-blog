const express = require("express")
const router = express.Router({mergeParams: true})

router.use("/auth", require("./auth.routes"))
router.use("/posts", require("./posts.routes"))
router.use("/comments", require("./comments.routes"))
router.use("/upload", require("./upload.routes"))

module.exports = router
