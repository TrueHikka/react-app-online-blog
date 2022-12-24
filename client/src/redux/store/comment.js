import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchComments = createAsyncThunk("posts/fetchComments" , async ({postId, comment}) => { //! асинхронный action 
	const {data} = await axios.get(`/comments/${postId}`, {
		postId,
        comment,
	}) 
	return data //! возвращаем то, что придет от бэка
})

export const fetchRemoveComments = createAsyncThunk("comments/fetchRemoveComments" , async (id) => 
	axios.delete(`/comments/${id}`)
)

const initialState = {
	comments: {
		items: [],
		status: "loading"
	}
}

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {},
	extraReducers: { //! описываем состояние нашего асинхронного action 
		[fetchComments.pending]: (state) => {
			state.posts.items = []
			state.posts.status = "loading"
		},
		[fetchComments.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = "loaded"
		},
		[fetchComments.rejected]: (state) => {
			state.posts.items = []
			state.posts.status = "error"
		},
		[fetchRemoveComments.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(item => item._id !== action.meta.arg)
		},
		[fetchRemoveComments.rejected]: (state) => {
			state.posts.status = "error"
		}
	}
})

// export const postsReducer = postsSlice.reducer
const {reducer: commentsReducer} = commentsSlice

export default commentsReducer