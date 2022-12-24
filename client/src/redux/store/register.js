import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchRegister = createAsyncThunk("/auth/fetchRegister", async (params) => {
	const {data} = await axios.post("/auth/register", params)
	return data
})

const initialState = {
	data: null,
	status: "loading",
}

const registerSlice = createSlice({
	name: "register",
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		}
	},
	extraReducers: {
		[fetchRegister.pending]: (state) => {
			state.data = null
			state.status = "loading"
		},
		[fetchRegister.fulfilled]: (state, action) => {
			state.data = action.payload
			state.status = "loaded"
		},
		[fetchRegister.rejected]: (state) => {
			state.data = null
			state.status = "error"
		}
	}
})	

export const selectIsAuth = (state) => Boolean(state.register.data)

const {reducer: registerReducer} = registerSlice

export default registerReducer