import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/store/register';

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	console.log({isAuth})

	const {register, handleSubmit, formState: {errors, isValid}} = useForm({ 
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			avatar: ""
		},
		mode: "onChange" 
	})

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values))
		console.log({data})
		console.log({values})

		if(!data.payload) {
			return alert("Не удалось зарегистрироваться!")
		}

		if("accessToken" in data.payload) {
			window.localStorage.setItem("accessToken", data.payload.accessToken)
		} 
	}

	if(isAuth) {
		return <Navigate to="/" />
	}

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form  onSubmit={handleSubmit(onSubmit)}>
	  <TextField 
			label="Полное имя" 
			className={styles.field} 
			helperText={errors.fullName?.message} 
			error={Boolean(errors.fullName?.message)} 
			{...register("fullName", {required: "Укажите Ваше имя"})}
			fullWidth 
	  />
      <TextField 
			label="E-Mail" 
			className={styles.field}
			type="email"
			helperText={errors.email?.message} 
			error={Boolean(errors.email?.message)}
			{...register("email", {required: "Укажите Вашу почту"})}
			fullWidth 
	  />
      <TextField 
			label="Пароль" 
			className={styles.field} 
			type="password"
			helperText={errors.password?.message} 
			error={Boolean(errors.password?.message)}
			{...register("password", {required: "Введите пароль"})}
			fullWidth 
	  />
	  <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
	  </form>
    </Paper>
  );
};
