package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func AcceptGroupNotification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var data Group
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		http.Error(w, "Erreur lors de l'ouverture de la base de données", http.StatusInternalServerError)
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	_, err = db.Exec(`INSERT INTO MEMBERSGROUPS (IDGroup, UserID) VALUES (?, ?)`, data.ID, data.IdWhoIsInvited)
	if err != nil {
		fmt.Println("Error while inserting into the database:", err)
		return
	}

	jsonResponse := map[string]interface{}{
		"success": true,
		"message": "You have joined the group",
	}
	if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}
