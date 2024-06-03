import React, { useEffect, useState } from 'react';
import { fetchNotification } from "@/services/useFetchNotif";

const NotificationFetcher = ({ id, setNotifications, notifications }) => {

    //const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotification(id, setNotifications);
    }, []);

    const removeNotification = async (id, category) => {
        console.log("category", category);
        try {
            const response = await fetch('http://localhost:8080/delete-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notification_id: id, category: category }),
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

    // Sort notifications by time
    const sortedNotifications = notifications.reverse()

    console.log('Sorted Notifications:', sortedNotifications);



    return (
        <div className="notification-container">
            <h1 className="notification-headers">Notification Fetcher</h1>
            <div id="notifications">
                {sortedNotifications && sortedNotifications.length > 0 ? sortedNotifications.map((notif) => (
                    <div key={notif.id} className="notification">
                        <button className="close-button" onClick={() => removeNotification(notif.id)}>×</button>
                        <div className="emoji-container">
                            {notif.category === 'Follow' && (
                                <span role="img" aria-label="Follow Emoji">➕</span>
                            )}
                            {notif.category === 'Group' && (
                                <span role="img" aria-label="Group Emoji">👥</span>
                            )}
                            {notif.category === 'MP' && (
                                <span role="img" aria-label="Message Emoji">💬</span>
                            )}
                            {notif.category === 'Comment' && (
                                <span role="img" aria-label="Comment Emoji">📥</span>
                            )}
                        </div>
                        <div className="notification-details">
                            {notif.category === 'Follow' && (
                                <>
                                    <p className="notification-group">Follow ID: {notif.id}</p>
                                    <div className="notification-date">{notif.date}</div>
                                    <p className="notification-title"><b>{notif.firstname} {notif.lastname} </b>vous a
                                        suivis !</p>
                                </>
                            )}
                            {notif.category === 'Group' && (
                                <>
                                    <p className="notification-group">Group ID: {notif.group.IdGroup}</p>
                                    <div className="notification-date">{notif.group.date}</div>
                                    <p className="notification-title">{notif.user.firstname} {notif.user.lastname} vous
                                        a invité au groupe <b>{notif.group.Title}</b> !</p>
                                </>
                            )}
                            {notif.category === 'MP' && (
                                <>
                                    <p className="notification-group">Message ID: {notif.message.id}</p>
                                    <div className="notification-date">{notif.message.date}</div>
                                    <p className="notification-title">{notif.user.firstname} {notif.user.lastname} vous
                                        a envoyé un message privé :</p>
                                    <div className="comment-content">
                                        <b><p>{notif.message.content}</p></b>
                                    </div>
                                </>
                            )}
                            {notif.category === 'Comment' && (
                                <>
                                    <p className="notification-group">Post ID: {notif.comment.post_id}</p>
                                    <div className="notification-date">{notif.comment.date}</div>
                                    <p className="notification-title">{notif.user.firstname} {notif.user.lastname} a
                                        commenté :</p>
                                    <div className="comment-content">
                                        <b><p>{notif.comment.content}</p></b>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="group-buttons">
                            {notif.category === 'Follow' && (
                                <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept</button>
                            )}
                            {notif.category === 'Group' && (
                                <>
                                    <button className="accept-button" onClick={() => acceptGroup(notif.id)}>Accept</button>
                                    <button className="reject-button" onClick={() => rejectGroup(notif.id, "group")}>Reject</button>
                                </>
                            )}
                        </div>
                    </div>
                )) : (
                    <p className="no-notifications">No notifications available</p>
                )}
            </div>
        </div>
    );
};

export default NotificationFetcher;
