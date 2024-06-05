package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetAllGroups(w http.ResponseWriter, r *http.Request) {
	var groupIDs []int

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	var MyId int

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		return
	}

	err = json.Unmarshal(body, &MyId)
	if err != nil {
		fmt.Println("Error unmarshalling request body:", err)
		http.Error(w, "Error unmarshalling request body", http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT IDGroup FROM MEMBERSGROUPS WHERE UserID = ?", MyId)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var idGroup int
		err := rows.Scan(&idGroup)
		if err != nil {
			fmt.Println(err)
			return
		}

		groupIDs = append(groupIDs, idGroup)
	}

	var groups []Group

	for _, idGroup := range groupIDs {
		row := db.QueryRow("SELECT IDGroup, NameGroup, AboutUs, UserID_Creator FROM LISTGROUPS WHERE IDGroup = ?", idGroup)

		var group Group
		err := row.Scan(&group.IdGroup, &group.Title, &group.AboutGroup, &group.UserID_Creator)
		if err != nil {
			fmt.Println(err)
			return
		}

		groups = append(groups, group)
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the status code to the response and the JSON data
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(groups)
}
