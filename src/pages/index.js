import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import CreatePostForm from '../components/CreatePostForm';
import PostContainer from '../components/PostContainer';
import usePosts from '../services/usePosts';
import useComments from '../services/useComments';


const Home = ({ loggedIn, username, setLoggedIn }) => {
  const router = useRouter(); // Using Next.js useRouter hook
  const { posts, createPost, fetchPosts } = usePosts();
  const { comments, createComment } = useComments();

  const handleCreatePost = async (formData) => {
    createPost(formData);
  };

  const handleCreateComment = async (formData) => {
    await createComment(formData);
    fetchPosts();
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
      {loggedIn && (
        <>
          <CreatePostForm handleCreatePost={handleCreatePost} />
          <PostContainer posts={posts} handleCreateComment={handleCreateComment} handlePostLike={handlePostLike} />
        </>
      )}
    </>

    </div>
  );
}

export default Home;
