package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func AskForJoinGroup(w http.ResponseWriter, r *http.Request) {
	var grp Group

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		return
	}

	err = json.Unmarshal(body, &grp)
	if err != nil {
		fmt.Println("Error unmarshalling request body:", err)
		http.Error(w, "Error unmarshalling request body", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	fmt.Println(grp.ID)
	fmt.Println(grp.IdGroup)

	// Insert the notification in the askgroup

	var UserIdCreator string
	now := time.Now()
	date := now.Format("2006-01-02 15:04:05")

	db.QueryRow("SELECT UserID_Creator FROM LISTGROUPS WHERE IDGroup = ?", grp.IdGroup).Scan(&UserIdCreator)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("USER ID CREATOR", UserIdCreator)

	_, err = db.Exec("INSERT INTO NOTIFICATIONS ( IDAsking, UserID_Sender,UserID_Receiver ,Date) VALUES (?, ?, ?, ?)", grp.IdGroup, grp.ID, UserIdCreator, date)
	if err != nil {
		fmt.Println(err)
		return
	}

	w.Write([]byte("User successfully joined the group"))
}
