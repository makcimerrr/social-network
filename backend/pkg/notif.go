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

	var ListFollowers []User
	var listMP, listPost, listComment, listGroup, listEvent [][]interface{}

	ListFollowers, listMP, listPost, listComment, listGroup, listEvent = GetNotif(data.UserIDReceiver, db)

	fmt.Println("ListFollowers:", ListFollowers)
	fmt.Println("listMP:", listMP)
	fmt.Println("listPost:", listPost)
	fmt.Println("listComment:", listComment)
	fmt.Println("listGroup:", listGroup)
	fmt.Println("listEvent:", listEvent)

	if len(ListFollowers) == 0 {
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": "Utilisateur introuvable",
		}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}

	jsonResponse := map[string]interface{}{
		"success":       true,
		"listFollowers": ListFollowers,
		"listMP":        listMP,
		"listPost":      listPost,
		"listComment":   listComment,
		"listGroup":     listGroup,
		"listEvent":     listEvent,
	}

	if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	/*notifications, err := getNotifications(db, data.UserIDReceiver)
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
	}*/
}
