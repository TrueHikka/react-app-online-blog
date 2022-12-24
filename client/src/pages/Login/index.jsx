import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form"
import {useDispatch, useSelector} from "react-redux"
import { fetchAuth, selectIsAuth } from "../../redux/store/auth";
import {Navigate} from "react-router-dom"

import styles from "./Login.module.scss";

export const Login = () => {
	const dispatch = useDispatch() 
	const isAuth = useSelector(selectIsAuth)
	console.log({isAuth})
	const {register, handleSubmit, formState: {errors, isValid}} = useForm({ //! если два наших поля рендерятся, то мы их сразу регистрируем в useForm, и он будет их обрабатывать
		defaultValues: {
			email: "",
			password: ""
		},
		mode: "onChange" //! валидация будет происходить в том случае, если эти поля поменялись  
	})

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values))
		console.log({data})
		console.log({values})
		if(!data.payload) {
			return alert("Не удалось авторизоваться!")
		}

		// const setTokens = "refreshToken" && "accessToken" && "expiresIn" && "userId"
		if("accessToken" in data.payload) {
			window.localStorage.setItem("accessToken", data.payload.accessToken)
			// window.localStorage.setItem("accessToken", data.payload.accessToken)
			// window.localStorage.setItem("expiresIn", data.payload.expiresIn)
			// window.localStorage.setItem("userId", data.payload.userId)
		} 
	}

	if(isAuth) {
		return <Navigate to="/" />
	}

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}> {/* handleSubmit выполнит onSubmit только в том случае, если два поля корректно провалидировались  */}
      	<TextField
	        className={styles.field}
	        label="E-Mail"
			type="email"
			helperText={errors.email?.message} //! если email нет в списке ошибок, то message не нужен 
	        error={Boolean(errors.email?.message)} //! если будет ошибка, то будет true, будет подсвечиваться красным
			{...register("email", {required: "Укажите Вашу почту"})} //! регистрация для react-hook-form
	        fullWidth
	      />
	      <TextField 
			className={styles.field} 
			label="Пароль" 
			type="password"
			helperText={errors.password?.message}
			error={Boolean(errors.password?.message)}
			{...register("password", {required: "Введите пароль"})}
			fullWidth 
		  />
	      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
	        Войти
	      </Button>
      </form>
    </Paper>
  );
};
