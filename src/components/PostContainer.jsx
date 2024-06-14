import React from 'react';
import CreateCommentForm from '../components/CreateCommentForm';
import CommentContainer from '../components/CommentContainer';
import { Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { parse, format } from 'date-fns';

const formatDate = (dateStr) => {
  const parsedDate = parse(dateStr, 'MM-dd-yyyy HH:mm:ss', new Date());
  return format(parsedDate, 'd MMMM yyyy, h\'h\' mm');
};

const PostContainer = ({ posts, handleCreateComment, handlePostLike }) => {
  const router = useRouter();
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
    <>
      <h2 className='pagetitle'>Posts</h2>

      <div className='postscontainer'>
        {posts && (
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <div className='post'>
                  <div>
                    <div className='post-header'>
                      <div className='post-username-container'>
                        <span className='pp'></span>
                        <p className='post-username' onClick={() => router.push(`/user?id=${post.user_id}`)}>
                          {post.user_id} ENZO LE BOSS
                        </p>
                      </div>
                      <p>
                        {formatDate(post.date)}
                      </p>
                    </div>
                    {post.image && (
                      <img
                        src={`data:image/jpeg;base64,${post.image}`}
                        alt="Selected Image"
                        className='post-image'
                      />
                    )}
                    <p className="post-title">
                      {post.title}
                    </p>
                    <p className="post-content">
                      {post.content}
                    </p>
                    <CardActions>
                      {post.likes && (
                        <>
                          <div
                            className="like-button liked"
                            variant="contained"
                            onClick={() => handlePostLike(post.id)}
                          ></div>
                        </>
                      )}
                      {!post.likes && (
                        <>
                          <div
                            className="like-button"
                            variant="contained"
                            onClick={() => handlePostLike(post.id)}
                          ></div>
                        </>
                      )}
                      
                      <p>{post.likes}</p>

                    </CardActions>


                    <div>
                      <CreateCommentForm handleCreateComment={handleCreateComment} Post_id={post.id} />
                      <CommentContainer Post_id={post.id} NbComments={post.nbcomments} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PostContainer;