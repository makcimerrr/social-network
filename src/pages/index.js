import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CreatePostForm from '../components/CreatePostForm';
import PostContainer from '../components/PostContainer';
import usePosts from '../services/usePosts';
import useComments from '../services/useComments';
import { conn, sendMsg } from '../services/useWebsocket';
import ChatContainer from '../components/ChatContainer';
import UserContainer from '../components/UserContainer';


const Home = ({ loggedIn, id }) => {
  const router = useRouter();
  const { posts, createPost, fetchPosts } = usePosts();
  const { comments, createComment } = useComments();

  const onButtonClick = async () => {
    if (!loggedIn) {
      router.push('/login')
    }
  };

  useEffect(() => {
    if (id) { // Vérifie si id n'est pas vide
      console.log(id);
      fetchPosts(id);
    }
  }, [id]);



  const handleCreatePost = async (formData) => {
    createPost(formData);
    sendMsg(conn, 0, { value: "New Post" }, 'post')
  };

  const handleCreateComment = async (formData) => {
    await createComment(formData);
    fetchPosts();
    sendMsg(conn, 0, { value: "New Comment" }, 'comment')
  };

  const handlePostLike = async (postId) => {
    try {
      const response = await fetch('http://localhost:8080/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error('Failed to like the post:', response.statusText);
      }
    } catch (error) {
      console.error('Error while liking the post:', error);
    }
  };


  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <>
        {loggedIn ? (
          <>

            <div className='test'>
              <UserContainer />
              <ChatContainer />
              <CreatePostForm handleCreatePost={handleCreatePost} />
              <PostContainer posts={posts} handleCreateComment={handleCreateComment} handlePostLike={handlePostLike} />
            </div>
          </>
        ) :
          <div className="mainContainer">
            <div className={'titleContainer'}>
              <div>Welcome!</div>
            </div>
            <div>This is the home page.</div>
            <div className={'buttonContainer'}>
              <input
                className={'inputButton'}
                type="button"
                onClick={onButtonClick}
                value={'Log in'}
              />
              <div> You are not logged in </div>
            </div>
          </div>
        }
      </>

    </div>
  );
}

export default Home;
