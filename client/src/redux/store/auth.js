import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

//! должны сделать запрос на redux и сказать, что когда сделался запрос, получить эту ин-цию и сохранить ее в redux
//! ин-цию, кот. будем получать от регистрации, передавать в эту функцию, она получит mail & password, и мы ее передадим в backend, он вернет ответ с нашей информацией, если все прошло норм, и мы сохраним ее в redux
export const fetchAuth = createAsyncThunk("/auth/fetchAuth", async (params) => { //! в params будет храниться информация об email & password
	const {data} = await axios.post("/auth/login", params) 
	return data
})

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe" , async () => {
	const {data} = await axios.get("/auth/me") 
	return data 
})

const initialState = {
	data: null,
	status: "loading",
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		}
	},
	extraReducers: {
		[fetchAuth.pending]: (state) => {
			state.data = null
			state.status = "loading"
		},
		[fetchAuth.fulfilled]: (state, action) => {
			state.data = action.payload
			state.status = "loaded"
		},
		[fetchAuth.rejected]: (state) => {
			state.data = null
			state.status = "error"
		},
		[fetchAuthMe.pending]: (state) => {
			state.data = null
			state.status = "loading"
		},
		[fetchAuthMe.fulfilled]: (state, action) => {
			state.data = action.payload
			state.status = "loaded"
		},
		[fetchAuthMe.rejected]: (state) => {
			state.data = null
			state.status = "error"
		}
	}
})

export const selectIsAuth = (state) => Boolean(state.auth.data);

const {reducer: authReducer, actions} = authSlice
export const {logout} = actions

export default authReducer
