import React, {useState, useEffect} from 'react';
import CreateCommentForm from '../components/CreateCommentForm';
import CommentContainer from '../components/CommentContainer';
import { Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import { useRouter } from 'next/router';



const PostContainer = ({ posts = [], handleCreateComment, handlePostLike }) => {
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  const fetchUsers = async (userIds) => {
    try {
      const userResponses = await Promise.all(
        userIds.map(id =>
          fetch(`http://localhost:8080/user?id=${id}`, {
            credentials: 'include'
          }).then(response => response.json())
        )
      );

      const usersData = userResponses.reduce((acc, userData) => {
        acc[userData.id] = userData;
        return acc;
      }, {});

      setUserDetails(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
    const userIds = posts.map(post => post.user_id);
    const uniqueUserIds = [...new Set(userIds)];
    fetchUsers(uniqueUserIds);
    }
  }, [posts]);

  const getPrivacyLabel = (privacy) => {
    switch (privacy) {
      case 0:
        return 'Private';
      case 1:
        return 'Public';
      case 2:
        return 'Semi-Private';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
      <h2>Posts</h2>
      {posts && (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {post.content}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Posted by{' '}
                    <Typography variant="body2" color="primary" component="a" onClick={() => router.push(`/user?id=${post.user_id}`)}>
                      {userDetails[post.user_id] ? userDetails[post.user_id].nickname : `User ID: ${post.user_id}`}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Date: {post.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Privacy: {getPrivacyLabel(post.privacy)}
                  </Typography>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={() => handlePostLike(post.id)}
                    >
                      Like
                    </Button>
                  </CardActions>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Likes: {post.likes}
                  </Typography>
                  {post.image && (
                    <img
                      src={`data:image/jpeg;base64,${post.image}`}
                      alt="Selected Image"
                    />
                  )}


                  <div>
                    Comments :
                    <CreateCommentForm handleCreateComment={handleCreateComment} Post_id={post.id} />
                    <CommentContainer Post_id={post.id} NbComments={post.nbcomments} />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostContainer;