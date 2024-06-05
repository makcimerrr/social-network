package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func AcceptGroupNotification(w http.ResponseWriter, r *http.Request) {
	var group Group
	fmt.Println("AcceptGroupNotification start")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		return
	}

	err = json.Unmarshal(body, &group)
	if err != nil {
		fmt.Println("Error unmarshalling request body:", err)
		http.Error(w, "Error unmarshalling request body", http.StatusBadRequest)
		return
	}

	/*	fmt.Println("Group ID: ", group.IdGroup)
		fmt.Println("idwhoisinvite", group.IdWhoIsInvited)*/

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	//deletenotification

	notifications, error := getNotifications(db, group.IdWhoIsInvited)
	if error != nil {
		fmt.Println(error)
	}

	fmt.Println(notifications)

	IDOfTheNotif := notifications[0].ID

	DeleteNotif(IDOfTheNotif, "inviteGroup", db)

	//fmt.Println("id du group", firstTwo) //delete the notification)

	_, err = db.Exec(`INSERT INTO MEMBERSGROUPS (IDGroup, UserID) VALUES (?, ?)`, group.IdGroup, group.IdWhoIsInvited)
	if err != nil {
		fmt.Println("Error while inserting into the database:", err)
		return
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the status code to the response and the JSON data
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group)
}
