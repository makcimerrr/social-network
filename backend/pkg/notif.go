package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type Receiver struct {
	UserIDReceiver int `json:"user_id_receiver"`
}

type Notification struct {
	ID               int    `json:"id"`
	IDPrivateMessage int    `json:"id_private_message"`
	IDPost           int    `json:"id_post"`
	IDComment        int    `json:"id_comment"`
	IDGroup          int    `json:"id_group"`
	IDEvent          int    `json:"id_event"`
	UserIDReceiver   int    `json:"user_id_receiver"`
	Date             string `json:"date"`
	Category         string `json:"category"`
	Message          string `json:"message"`
}

func getCategory(notif Notification) string {
	if notif.IDPrivateMessage != 0 {
		return "PrivateMessage"
	} else if notif.IDPost != 0 {
		return "Post"
	} else if notif.IDComment != 0 {
		return "Comment"
	} else if notif.IDGroup != 0 {
		return "Group"
	} else if notif.IDEvent != 0 {
		return "Event"
	}
	return "Unknown"
}

func getNotifications(db *sql.DB, userID int) ([]Notification, error) {
	rows, err := db.Query(`
		SELECT IDNotif, IDPrivateMessage, IDPost, IDComment, IDGroup, IDEvent, UserID_Receiver, Date
		FROM NOTIFICATIONS
		WHERE UserID_Receiver = ?
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification

	for rows.Next() {
		var notif Notification
		err := rows.Scan(&notif.ID, &notif.IDPrivateMessage, &notif.IDPost, &notif.IDComment, &notif.IDGroup, &notif.IDEvent, &notif.UserIDReceiver, &notif.Date)
		if err != nil {
			return nil, err
		}
		notif.Category = getCategory(notif)
		notifications = append(notifications, notif)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}

func NotifHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var data Receiver
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println("Data received:", data.UserIDReceiver)

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		http.Error(w, "Erreur lors de l'ouverture de la base de données", http.StatusInternalServerError)
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	notifications, err := getNotifications(db, data.UserIDReceiver)
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des notifications", http.StatusInternalServerError)
		fmt.Println("Erreur lors de la récupération des notifications:", err)
		return
	}

	fmt.Println("Notifications:", notifications)

	if notifications != nil {
		jsonResponse := map[string]interface{}{
			"success": true,
			"data":    notifications,
		}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": "Utilisateur introuvable",
		}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
