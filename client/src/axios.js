import axios from "axios";
import confiFile from "./config.json"

const http = axios.create({
	baseURL: confiFile.apiEndPoint
})

// const setTokens = "refreshToken" && "accessToken" && "expiresIn" && "userId"

http.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem("accessToken")
	return config
})

export default http;







