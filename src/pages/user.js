import { useState, useEffect } from 'react';
import useUsers from '../services/useUsers';
import ProfileContainer from '../components/ProfileContainer';


const User = ({id}) => {
  const { users, userPosts, fetchUsers } = useUsers();

  const togglePrivacy = async () => {
    try {
        const response = await fetch('http://localhost:8080/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
        });
        if (response.ok) {
            fetchUsers(response.ID);
        }
        if (!response.ok) {
            throw new Error('Failed to update privacy setting');
        }
    } catch (error) {
        console.error('Error updating privacy setting:', error.message);
    }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ProfileContainer users={users} userPosts={userPosts} togglePrivacy={togglePrivacy} id={id}/>
      </div>

);
};

export default User;