const tokenService = require("../services/token.service")

module.exports = (req, res, next) => {
	if(req.method === "OPTIONS") { 
		return next()
	}

	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	
	if(token) {
		try {
			const data = tokenService.validateAccess(token)

			req.user = data
		
		next()
		} catch (error) {
			return res.status(403).json({
        message: 'Нет доступа',
      }) 
		} 
	} else {
		return res.status(403).json({
		  message: 'Нет доступа',
		});
	  }

	// try {
	// 	// const token = req.headers.authorization.replace(/Bearer\s?/, '')
	// 	const token = req.headers.authorization.split(' ')[1]
	// 	console.log({token})
	// 	if(!token) {
	// 		return res.status(401).json({
	// 			message: "Не авторизован"
	// 		})
	// 	}

	// 	const data = tokenService.validateAccess(token)
		
	// 	if(!data) {
	// 		return res.status(401).json({
	// 			message: "Не авторизован"
	// 		})
	// 	}
	// 	// console.log("Decoded", data)
	// 	// console.log(req.newUserId)
	// 	req.user = data
		
	// 	next()
	// } catch (error) {
	// 	return res.status(401).json({message: 'Unauthorized'})
	// }
}









