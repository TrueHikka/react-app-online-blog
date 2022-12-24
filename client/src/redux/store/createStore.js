import { combineReducers, configureStore} from "@reduxjs/toolkit"
import authReducer from "./auth"
import commentsReducer from "./comment"
import postsReducer from "./posts"
import registerReducer from "./register"
import tagsReducer from "./tags"

// const store = configureStore({
// 	reducer: {}
// })

// export default store

const rootReduser = combineReducers({
	posts: postsReducer,
	tags: tagsReducer,
	auth: authReducer,
	register: registerReducer,
	comments: commentsReducer
})

export function createStore() {
	return configureStore({
		reducer: rootReduser
	})
}







