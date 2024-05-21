import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const id = router.query.id; // Extract id from the query parameters
        if (!id) return; // Check if id is available
        const response = await fetch(`http://localhost:8080/user?id=${id}`, {
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

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUserPosts(data);
        } else {
          console.error('Failed to fetch user posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    useEffect(() => {
      fetchUsers();
      fetchUserPosts();// Fetch users when component mounts or when id changes
    }, [router.query.id]);

    return { users, userPosts, fetchUsers };
};

export default useUsers;