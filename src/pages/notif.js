import React, {useEffect, useState} from 'react';

const NotificationFetcher = ({id}) => {
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
                body: JSON.stringify({user_id_receiver: id}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("notif", data);
            if (data.success) {
                const allNotifications = [];
                if (data.listFollowers) {
                    data.listFollowers.forEach(element => {
                        console.log("Followers: ", element);
                        allNotifications.push(element);
                    });
                }
                if (data.listFollowers) {
                    data.listGroup.forEach(element => {
                        if (Array.isArray(element)) {
                            const notification = {
                                category: 'Group',
                                user: element[0],
                                group: element[1]
                            };
                            console.log("Notification: ", notification);
                            allNotifications.push(notification);
                        }
                    });
                }

                setNotifications(allNotifications);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const removeNotification = async (id, category) => {
        console.log("category",category )
        try {
            const response = await fetch('http://localhost:8080/delete-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({notification_id: id, category: category}),
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
        console.log(`Accepted group invitation for notification ID: ${id}`);
        // TODO: Handle acceptance logic here
    };

    const rejectGroup = (id, category) => {
        console.log(`Rejected group invitation for notification ID: ${id}`);
        removeNotification(id, category);
    };

    return (
        <div className="notification-container">
            <h1 className="notification-header">Notification Fetcher</h1>
            <div id="notifications">
                {notifications.length > 0 ? notifications.map((notif) => (
                    <div key={notif.id} className="notification">
                        <button className="close-button" onClick={() => removeNotification(notif.id)}>×</button>
                        {notif.category === 'Follow' && (
                            <>
                                <p className="notification-follow">Follow ID: {notif.id}</p>
                                <p className="notification-title"><b>{notif.firstname} {notif.lastname} </b>vous a suivis !</p>
                                <div className="group-buttons">
                                    <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept
                                    </button>
                                    <button className="reject-button" onClick={() => rejectGroup(notif.id, "follow")}>Reject
                                    </button>
                                </div>
                            </>
                        )}
                        {notif.category === 'Group' && (
                            <>
                                <p className="notification-group">Group ID: {notif.group.IdGroup}</p>
                                <p className="notification-title">{notif.user.firstname} {notif.user.lastname} vous a
                                    invité au groupe <b>{notif.group.Title}</b> !</p>
                                <div className="group-buttons">
                                    <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept
                                    </button>
                                    <button className="reject-button" onClick={() => rejectGroup(notif.id, "group")}>Reject
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )) : (
                    <p className="no-notifications">No notifications available</p>
                )}
            </div>
        </div>
    );
};

export default NotificationFetcher;
