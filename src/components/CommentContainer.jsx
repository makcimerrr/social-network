import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useComments from '../services/useComments';

const CommentContainer = ({ Post_id, NbComments }) => {
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const { comments, fetchComments } = useComments(Post_id);

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
    if (comments && comments.length > 0) {
      const userIds = comments.map(comment => comment.user_id);
      const uniqueUserIds = [...new Set(userIds)];
      fetchUsers(uniqueUserIds);
    }
  }, [comments]);

  const handleFetchComments = () => {
    setFetching(true);
    fetchComments(Post_id)
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  };

  return (
    <div>
      <h2>Comments</h2>
      <Button
        variant="contained"
        onClick={handleFetchComments}
        disabled={fetching}
      >
        Comments ({NbComments})
      </Button>
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <Typography variant="body2" color="textSecondary" component="p">
                Commented by{' '}
                <Typography
                  variant="body2"
                  color="primary"
                  component="span"
                  onClick={() => router.push(`/user?id=${comment.user_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {userDetails[comment.user_id] ? userDetails[comment.user_id].nickname : `User ID: ${comment.user_id}`}
                </Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Date: {comment.date}
              </Typography>
              {comment.image && (
                <img
                  src={`data:image/jpeg;base64,${comment.image}`}
                  alt="Comment Image"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Typography variant="body2" color="textSecondary" component="p">
          No comments available.
        </Typography>
      )}
    </div>
  );
};

export default CommentContainer;
