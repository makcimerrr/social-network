import { useState, useEffect } from 'react';

const useUsers = () => {
    const [users, setUsers] = useState([]);
  
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/user',{
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    return { users, fetchUsers };
};

export default useUsers;