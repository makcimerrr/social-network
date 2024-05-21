package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
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

	cookie, err := r.Cookie("session")
	if err != nil {
		// Gérer l'erreur si le cookie n'est pas trouvé
		http.Error(w, "Session cookie not found", http.StatusUnauthorized)
		return
	}

	fmt.Println("après recupération du cookie")

	fmt.Println("Session cookie value:", cookie.Value)

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	var userid int
	err = Getverif(db, w, r)
	fmt.Println(userid)
	//si la personne existe dans la base de données ou si elle n'est pas déjà dans le groupe.
	//err = CheckConditions(db, w, r, invite)
	//notification.InsertNotification(w, r, db, invite.NameOfThePerson, "invite", invite.NameOfGroup)
}

/*func CheckConditions(w http.ResponseWriter, r *http.Request, db *sql.DB, invite InviteInTheGroup) error {

	if NameGroup != "" {
		var existingNameGroup string
		err := db.QueryRow("SELECT NameGroup FROM LISTGROUPS WHERE NameGroup = ?", registerData.NameGroup).Scan(&existingNameGroup)

		if err != nil {
			if err == sql.ErrNoRows {
				return nil
			}
			return err
		}
		return fmt.Errorf("Group name already exists")

	}
	return nil

}*/

func Getverif(db *sql.DB, w http.ResponseWriter, r *http.Request) error {
	//var missing int

	// verif si l'utilisateur invité existe
	fmt.Println("AVANT LA REQUETE")
	fmt.Println(invite.NameOfThePerson)

	rows, err := db.Query("SELECT ID FROM USERS WHERE FirstName = ? OR Nickname = ?", invite.NameOfThePerson, invite.NameOfThePerson)
	if err != nil {
		fmt.Println("Erreur lors de l'exécution de la requête :", err)
		return err
	}
	defer rows.Close()

	if rows.Next() {
		fmt.Println("La personne est bien dans la base de données")
		return nil
	} else {
		fmt.Println("Aucun utilisateur trouvé avec ce nom ou ce surnom.")
		return nil
	}
}
