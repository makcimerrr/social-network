import { useState, useEffect } from 'react';
import useUsers from '../services/useUsers';
import ProfileContainer from '../components/ProfileContainer';


const User = () => {
  const { users, fetchUsers } = useUsers();

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
            fetchUsers();
        }
        if (!response.ok) {
            throw new Error('Failed to update privacy setting');
        }
    } catch (error) {
        console.error('Error updating privacy setting:', error.message);
    }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

      <h1>User Page</h1>
      {/* Display fetched users */}
      <ProfileContainer users={users} togglePrivacy={togglePrivacy}/>

      </div>

);
};

export default User;