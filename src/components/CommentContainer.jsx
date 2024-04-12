import React, { useState } from 'react';
import { Button } from '@mui/material';
import useComments from '../services/useComments';

const CommentContainer = ({ Post_id, NbComments }) => {
  const [fetching, setFetching] = useState(false);
  const { comments, fetchComments } = useComments(Post_id);
  const handleFetchComments = () => {
    console.log(Post_id)
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
        {NbComments}
      </Button>
      {comments && (
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <p>Commented by User ID: {comment.user_id}</p>
              <p>Date: {comment.date}</p>
              <p>Likes:</p>

              {comment.image && (
                <img
                  src={`data:image/jpeg;base64,${comment.image}`}
                  alt="Selected Image"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentContainer;