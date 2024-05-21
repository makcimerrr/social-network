

import React from 'react';
import { Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import CommentContainer from '../components/CommentContainer';


const ProfileContainer = ({ users, userPosts, togglePrivacy, id }) => {
    const getPrivacyLabel = (privateprofile) => {
        privateprofile = parseInt(privateprofile);
        switch (privateprofile) {
            case 0:
                return 'Private';
            case 1:
                return 'Public';
            default:
                return 'Unknown';
        }
    };

    return (
        <div>

<h2>Infos</h2>
            <p>ID: {users.id}</p>
            <p>Email: {users.email}</p>
            <p>Firstname: {users.firstname}</p>
            <p>Lastname: {users.lastname}</p>
            <p>Date of Birth: {users.dateofbirth}</p>
            <p>Avatar: {users.avatar}</p>
            <p>Nickname: {users.nickname}</p>
            <p>About Me: {users.aboutme}</p>
            <p>Private Profile: {getPrivacyLabel(users.privateprofile)}</p>

            {users.id === id ? (
                <>
                    <p>List of follows/followers</p>
                    <button onClick={togglePrivacy}>Toggle Privacy</button>
                    {users.privateprofile == 0 && <p>Accept/Reject Demands</p>}
                </>
            ) : (
                <>
                {users.privateprofile == 1 && <p>List of follows/followers</p>}
                <p>Ask/Stop follow</p>
                </>
            )}

            <p>Point of Interest: {users.pointofinterest}</p>

<h2>My Posts</h2>
{userPosts && (
  <ul>
    {userPosts.map(post => (
      <li key={post.id}>
        {post.user_id === id && (
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
              <Typography variant="body2" color="primary" component="a">
                User ID: {post.user_id}
              </Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Date: {post.date}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Privacy: {getPrivacyLabel(post.privacy)}
            </Typography>
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
              <CommentContainer Post_id={post.id} NbComments={post.nbcomments} />
            </div>
          </CardContent>
        </Card>
        )}
      </li>
    ))}
  </ul>
)}
</div>
    );
};

export default ProfileContainer;