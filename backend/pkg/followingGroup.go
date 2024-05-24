package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

var invite InviteInTheGroup

func Inviteinmygroup(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		return
	}

	fmt.Println("Received invite in Go:", string(body))

	err = json.Unmarshal(body, &invite)
	if err != nil {
		fmt.Println("Error unmarshalling request body:", err)
		http.Error(w, "Error unmarshalling request body", http.StatusBadRequest)
		return
	}

	fmt.Println("name of the group", invite.NameOfGroup)
	fmt.Println("name of the person", invite.NameOfThePerson)
	fmt.Println("avant recupération du cookie")

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	var userid int
	var groupid int
	var myid int

	err, myid = WhoAmI(db, w, r)
	if err != nil {
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": err.Error(),
		}
		err := json.NewEncoder(w).Encode(jsonResponse)
		if err != nil {
			return
		}
		return
	}

	err, groupid = GetGroupID(db, w, r)
	if err != nil {
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": err.Error(),
		}
		err := json.NewEncoder(w).Encode(jsonResponse)
		if err != nil {
			return
		}
		return
	}

	err, userid = Getverif(db, w, r, myid)
	if err != nil {
		fmt.Println("IIIIIIICCCCCCCIIIIIII")
		fmt.Println(err)
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": err.Error(),
		}
		err := json.NewEncoder(w).Encode(jsonResponse)
		if err != nil {
			return
		}
		return
	}

	fmt.Println("PASSE LES TESTS")
	now := time.Now()
	date := now.Format("2006-01-02 15:04:05")

	InsertNotif(groupid, userid, date, "groupInvite", db)

	jsonResponse := map[string]interface{}{
		"success": true,
	}
	err = json.NewEncoder(w).Encode(jsonResponse)
	if err != nil {
		fmt.Println("Error encoding JSON response:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("Invitation envoyée")

	//si la personne existe dans la base de données ou si elle n'est pas déjà dans le groupe.
	//err = CheckConditions(db, w, r, invite)
	//notification.InsertNotification(w, r, db, invite.NameOfThePerson, "invite", invite.NameOfGroup)
}

func GetGroupID(db *sql.DB, w http.ResponseWriter, r *http.Request) (error, int) {

	groupid := 0

	db.QueryRow("SELECT IDGroup FROM LISTGROUPS WHERE NameGroup = ?", invite.NameOfGroup).Scan(&groupid)

	if groupid != 0 {
		fmt.Println("La personne est bien dans la base de données")
		return nil, groupid
	} else {
		return fmt.Errorf("Le groupe n'existe pas !"), 0
	}

}

func Getverif(db *sql.DB, w http.ResponseWriter, r *http.Request, myid int) (error, int) {
	fmt.Println("AVANT LA REQUETE")
	fmt.Println(invite.NameOfThePerson)
	fmt.Println(myid)
	existingUserID := 0

	db.QueryRow("SELECT ID FROM USERS WHERE FirstName = ? OR Nickname = ?", invite.NameOfThePerson, invite.NameOfThePerson).Scan(&existingUserID)

	if myid == existingUserID {
		return fmt.Errorf("Vous ne pouvez pas vous ajouter vous-même"), 0
	} else if existingUserID != 0 {
		return nil, existingUserID
	} else {
		return fmt.Errorf("Aucun utilisateur trouvé avec ce nom ou ce surnom"), 0
	}
}
