export async function handlePostLike(postId) {
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