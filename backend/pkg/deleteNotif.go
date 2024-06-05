package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func DeleteNotificationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var data struct {
		NotificationID int    `json:"notification_id"`
		Category       string `json:"category"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ici, supprime la notification avec l'ID fourni de votre base de données
	fmt.Println("Notification deleted with ID:", data.NotificationID)
	fmt.Println("Category:", data.Category)

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	DeleteNotif(data.NotificationID, data.Category, db)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonResponse := map[string]interface{}{
		"success": true,
		"message": "Notification deleted successfully",
	}
	json.NewEncoder(w).Encode(jsonResponse)
}

func DeleteNotification(notificationID int) error {
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		return err
	}
	defer db.Close()

	// Prépare la requête SQL pour supprimer la notification avec l'ID spécifié
	query := "DELETE FROM NOTIFICATIONS WHERE IDNotif = ?"
	stmt, err := db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(notificationID)
	if err != nil {
		return err
	}

	return nil
}
