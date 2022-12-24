import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
// import { CommentsBlock } from '../components/CommentsBlock';
import {useDispatch, useSelector} from "react-redux"
import { fetchPosts} from '../redux/store/posts';
import { fetchTags } from '../redux/store/tags';
// import { fetchComments } from '../redux/store/comment';

export const Home = () => {
	const userData = useSelector(state => state.auth.data)
	const {posts} = useSelector(state => state.posts)
	const {tags} = useSelector(state => state.tags)
	// const {comments} = useSelector(state => state.comments)
console.log({tags})
console.log({posts})
	const isPostLoading = posts.status === "loading"
	const isTagsLoading = tags.status === "loading"

	const dispatch = useDispatch() 
	useEffect(() => {
		dispatch(fetchPosts()) //! для обработки асинхронного action
		dispatch(fetchTags())
		// dispatch(fetchComments())
	}, [])
	
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((item, index) => isPostLoading ? (
            <Post key={index} isLoading={true}/>
          ) : (
			<Post
              id={item._id}
              title={item.title}
              imageUrl={item.imageUrl ? `http://localhost:4000/${item.imageUrl}` : ""}
              user={item.user}
              createdAt={item.createdAt}
              viewsCount={item.viewsCount}
              commentsCount={3}
              tags={item.tags}
              isEditable = {userData?._id === item.user._id}
            />
		  )
		  )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock posts={posts.items} items={tags.items} isLoading={isTagsLoading} />
          {/* <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это  комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          /> */}
        </Grid>
      </Grid>
    </>
  );
};
