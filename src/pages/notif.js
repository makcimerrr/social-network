import React, {useEffect, useState} from 'react';

const NotificationFetcher = (form) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotification();
    }, []);

    const fetchNotification = async () => {
        try {
            const response = await fetch('http://localhost:8080/notif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id_receiver: form.id}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                setNotifications(data.data);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    /*const removeNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));

    };*/

    const removeNotification = async (id) => {
        try {
            const response = await fetch('http://localhost:8080/delete-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notification_id: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            setNotifications(notifications.filter(notif => notif.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };



    const acceptGroup = (id) => {
        // Placeholder function to handle accepting a group invitation
        console.log(`Accepted group invitation for notification ID: ${id}`);
    };

    const rejectGroup = (id) => {
        // Placeholder function to handle rejecting a group invitation
        console.log(`Rejected group invitation for notification ID: ${id}`);
        removeNotification(id); // Remove the notification after rejection
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h1>Notification Fetcher</h1>
                <div id="notifications">
                    {notifications.length > 0 ? notifications.map((notif) => (
                        <div key={notif.id} className={notif.category}>
                            <button className="close-button" onClick={() => removeNotification(notif.id)}>×</button>
                            <p>Date: {notif.date}</p>
                            <p>Category: {notif.category}</p>
                            {notif.category === 'Group' && <p>Group ID: {notif.id_group}</p>}
                            {notif.category === 'Event' && <p>Event ID: {notif.id_event}</p>}
                            {notif.category === 'Group' && (
                                <div className="group-buttons">
                                    <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept</button>
                                    <button className="reject-button" onClick={() => rejectGroup(notif.id)}>Reject</button>
                                </div>
                            )}
                            {notif.category === 'PrivateMessage' && (
                                <div className="group-buttons">
                                    <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept</button>
                                    <button className="reject-button" onClick={() => rejectGroup(notif.id)}>Reject</button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <p>No notifications available</p>
                    )}
                </div>
        </div>
    );
};

export default NotificationFetcher;
