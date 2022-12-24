import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// Необходимо отправить этот запрос на бэк
export const fetchPosts = createAsyncThunk("posts/fetchPosts" , async () => { //! асинхронный action 
	const {data} = await axios.get("/posts") 
	return data //! возвращаем то, что придет от бэка
})

export const fetchRemovePost = createAsyncThunk("posts/fetchRemovePost" , async (id) => 
	axios.delete(`/posts/${id}`)
)

const initialState = {
	posts: {
		items: [],
		status: "loading"
	}
}

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: { //! описываем состояние нашего асинхронного action 
		[fetchPosts.pending]: (state) => {
			state.posts.items = []
			state.posts.status = "loading"
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = "loaded"
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = []
			state.posts.status = "error"
		},
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(item => item._id !== action.meta.arg)
		},
		[fetchRemovePost.rejected]: (state) => {
			state.posts.status = "error"
		}
	}
})

// export const postsReducer = postsSlice.reducer
const {reducer: postsReducer} = postsSlice

export default postsReducer








