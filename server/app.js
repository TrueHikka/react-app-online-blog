const chalk = require("chalk")
const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const routes = require("./routes")
const path = require("path")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use("/api", routes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// app.use("/", express.static(path.join(__dirname, "client")))

const PORT = config.get("port") ?? 4000

async function startServer() {
	try {
		await mongoose.connect(config.get("mongoUri"))
		console.log(chalk.bgYellow(`MongoDB connected.`))
		app.listen(PORT, () => {
			console.log(chalk.bgGreen(`Server has been started on port ${PORT}...`))
		})
	} catch (error) {
		console.log(chalk.bgRed(e.message))
		process.exit(1)
	}
}

startServer()






