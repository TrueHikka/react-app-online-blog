const {body} = require("express-validator")

const registerValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль должен содержать минимум 8 символов").isLength({min: 8}),
	body("fullName", "Имя должно содержать не менее 3 символов").isLength({min: 3}),
	body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL()
]

const authValidation = [
	body("email", "Некорректный email").normalizeEmail().isEmail(),
	body("password", "Пароль не может быть пустым").exists()
]

const postCreateValidation = [
	body("title", "Введите заголовок статьи").isLength({min: 5}).isString(),
	body("text", "Введите текст статьи").isLength({min: 10}).isString(),
	body("tags", "Неверный формат тэгов").optional().isArray(),
	body("imageUrl", "Неверная ссылка на изображение").optional().isString()
]

module.exports = {
	registerValidation, authValidation, postCreateValidation
}