import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchTags = createAsyncThunk("tags/fetchTags" , async () => { //! асинхронный action 
	const {data} = await axios.get("/posts/tags") 
	return data //! возвращаем то, что придет от бэка
})

const initialState = {
	tags: {
		items: [],
		status: "loading"
	}
}

const tagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {},
	extraReducers: { //! описываем состояние нашего асинхронного action 
		[fetchTags.pending]: (state) => {
			state.tags.items = []
			state.tags.status = "loading"
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload
			state.tags.status = "loaded"
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = []
			state.tags.status = "error"
		},
	}
})

// export const tagsReducer = tagsSlice.reducer
const {reducer: tagsReducer} = tagsSlice

export default tagsReducer