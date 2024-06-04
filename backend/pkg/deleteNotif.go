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

	var group Group

	if err := json.NewDecoder(r.Body).Decode(&group); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	notifications, error := getNotifications(db, group.IdWhoIsInvited)
	if error != nil {
		fmt.Println(error)
	}

	IDOfTheNotif := notifications[0].ID

	DeleteNotif(IDOfTheNotif, "inviteGroup", db)

	fmt.Println("Notification deleted successfully")

	jsonResponse := map[string]interface{}{
		"success": true,
		"message": "Notification deleted successfully",
	}
	json.NewEncoder(w).Encode(jsonResponse)
}

/*func DeleteNotification(notificationID int) error {
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
*/
