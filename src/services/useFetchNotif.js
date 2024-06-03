export const fetchNotification = async (id, setNotifications) => {
    try {
        console.log("id", id)
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

        const text = await response.text(); // Lire la réponse comme du texte
        console.log("Raw response text:", text);

        const data = JSON.parse(text); // Analyser le texte en JSON
        console.log("notif", data);

        if (data.success) {
            const allNotifications = [];
            if (data.listFollowers) {
                data.listFollowers.forEach(element => {
                    console.log("Followers: ", element);
                    allNotifications.push(element);
                });
            }

            if (data.listMP) {
                data.listMP.forEach(element => {
                    const notification = {
                        category: 'MP',
                        user: element[0],
                        message: element[1]
                    };
                    console.log("Notification MP: ", notification);
                    allNotifications.push(notification);
                });
            }

            if (data.listComment) {
                data.listComment.forEach(element => {
                    if (Array.isArray(element)) {
                        const notification = {
                            category: 'Comment',
                            user: element[0],
                            comment: element[1],
                            post: element[2]
                        };
                        console.log("Notification: ", notification);
                        allNotifications.push(notification);
                    }
                });
            }
            if (data.listGroup) {
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
            const PastilleNotif = allNotifications.length
        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error NOTIF:', error.message);
    }
};
