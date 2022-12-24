import React, { useState, useMemo, useCallback, useRef, useEffect   } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import { selectIsAuth } from '../../redux/store/auth';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
	const {id} = useParams()
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	console.log({isAuth})
	const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
	try {
		const formData = new FormData() //! спец. формат, кот. позволит нам загружать картинку, вшивать ее и отправлять на бэкэнд
		const file = event.target.files[0] //! получаем картинку
		formData.append("image", file) //! передаем на сервак
		const {data} = await axios.post("/upload", formData)
		console.log(data)
		setImageUrl(data.path)
	} catch (error) {
		console.warn(error)
		alert("Ошибка при загрузке файла!")
	}
  };

  const onClickRemoveImage = () => {
	setImageUrl(null)
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
	try {
		setLoading(true)
		const fields = {
			title,
			text,
			tags: tags.split(","),
			imageUrl
		}

		const {data} = isEditing 
			? await axios.patch(`/posts/${id}`, fields) 
			: await axios.post("/posts", fields)

		const postId = isEditing 
			? id
			: data._id
			
		navigate(`/posts/${postId}`)
	} catch (error) {
		console.warn(error)
		alert("Ошибка при создании статьи!")
	}
  }

  useEffect(() => {
	if(id) {
		axios.get(`/posts/${id}`)
		.then(({data}) => {
			setTitle(data.title)
			setText(data.text)
			setTags(data.tags.join(","))
			setImageUrl(data.imageUrl)
		})
		.catch((error) => {
			console.warn(error)
			alert("Ошибка при получении статьи!")
		})
	}
  }, [])

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!window.localStorage.getItem("accessToken") && !isAuth) {
	return <Navigate to="/" />
}

console.log({title, tags, text})

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input 
		ref={inputFileRef}
		type="file" 
		onChange={handleChangeFile} 
		hidden 
	  />
      {imageUrl && (
		<>
			<Button variant="contained" color="error" onClick={onClickRemoveImage}>
			Удалить
			</Button>
			<img className={styles.image} src={`http://localhost:4000/${imageUrl}`} alt="Uploaded" />
		</>
      )}
      <br />
      <br />
      <TextField
			classes={{ root: styles.title }}
			variant="standard"
			placeholder="Заголовок статьи..."
			value={title}
			onChange={(e) => setTitle(e.target.value)}
			fullWidth
      />
      <TextField 
			classes={{ root: styles.tags }} 
			variant="standard" 
			placeholder="Тэги" 
			value={tags}
			onChange={(e) => setTags(e.target.value)}
			fullWidth 
	  />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
