package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func FollowHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/follow" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}
	// FIXME: check du cookies ICI
	// cookie, err := r.Cookie("session")
	// if err != nil {
	// 	fmt.Println("Error cookie FollowHandler")
	// }
	// curr, err := CurrentUser(cookie.Value)
	// if err != nil {
	// 	http.Error(w, "500 internal server error", http.StatusInternalServerError)
	// 	return
	// }
	// Ouverture db
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()
	// FIXME: gestion des follow ici
	// if newFollow {
	// 	newFollow(UserID_Following, UserID_Followers, db)
	// }
	// if validationFollow True {
	// 	validateFollow(UserID_Following, UserID_Followers, db)
	// } else if validationFollow False {
	// 	deleteFollow(UserID_Following, UserID_Followers, db)
	// }
	// if deleteFollow {
	// 	deleteFollow(UserID_Following, UserID_Followers, db)
	// }
	resp := Resp{
		Msg: "Recharger la page",
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "500 internal server error", http.StatusInternalServerError)
		return
	}
}

func newFollow(UserID_Following, UserID_Followers int, db *sql.DB) {
	var currentTime = time.Now()
	englishDateTime := currentTime.Format("01/02/2006 15:04:05")
	// Vérification de la privacité du profil follow
	respPrivateProfile, errdb := db.Prepare("SELECT PrivateProfile FROM USERS WHERE ID = ?")
	CheckErr(errdb, "3-newFollow Requete DB")
	var privateProfile bool
	respPrivateProfile.QueryRow(UserID_Following).Scan(&privateProfile)

	// insertion dans la table FOLLOWERS
	stmt, err := db.Prepare("INSERT INTO FOLLOWERS(UserID_Following,UserID_Follower,DateFollow,ValidateFollow) Values(?,?,?,?)")
	CheckErr(err, "1-newFollow Prepare db")
	result, err := stmt.Exec(UserID_Following, UserID_Followers, englishDateTime, !privateProfile) // false insert '0',true insert '1'
	CheckErr(err, "1- newFollow db Exec")

	if privateProfile { // si profil privée, nécessite la validation : donc une notification
		// récupération de l'ID
		lastInsertID, err := result.LastInsertId()
		CheckErr(err, "2-newFollow Getting last insert ID")
		// insertion dans la table NOTIFICATIONS
		InsertNotif(int(lastInsertID), UserID_Followers, englishDateTime, "follow", db)
	}
}

func validateFollow(UserID_Following, UserID_Followers int, db *sql.DB) {
	stmt, err := db.Prepare("UPDATE FOLLOWERS SET ValidateFollow = 1 WHERE UserID_Following = ? AND UserID_Follower = ?")
	CheckErr(err, "validateFollow Prepare db")
	_, err = stmt.Exec(UserID_Following, UserID_Followers)
	CheckErr(err, "validateFollow db Exec")
}

func deleteFollow(UserID_Following, UserID_Followers int, db *sql.DB) {
	respPrivateProfile, errdb := db.Prepare("SELECT IDFollow FROM FOLLOWERS WHERE UserID_Following = ? AND UserID_Follower = ?")
	CheckErr(errdb, "1-deleteFollow Requete DB")
	idFollow := 0
	respPrivateProfile.QueryRow(UserID_Following, UserID_Followers).Scan(&idFollow)

	if idFollow != 0 {
		DeleteNotif(idFollow, "follow", db)
	}

	stmt, err := db.Prepare("DELETE FROM FOLLOWERS WHERE UserID_Following = ? AND UserID_Follower = ?")
	CheckErr(err, "deleteFollow Prepare db")
	_, err = stmt.Exec(UserID_Following, UserID_Followers)
	CheckErr(err, "deleteFollow db Exec")
}

// Retourne la liste des followers ou des followings donc option = 'followers' ou 'followings'
func ListFollow(UserID_Following int, option string, db *sql.DB) (listuser []User) {
	var stmt *sql.Stmt
	var err error
	if option == "followings" {
		stmt, err = db.Prepare(`SELECT USERS.ID, USERS.FirstName, USERS.LastName, USERS.Avatar, USERS.Nickname
										FROM USERS
										INNER JOIN FOLLOWERS ON FOLLOWERS.UserID_Follower = USERS.ID
										WHERE FOLLOWERS.ValidateFollow = '1' AND FOLLOWERS.UserID_Following = ?;`)
	} else if option == "followers" {
		stmt, err = db.Prepare(`SELECT USERS.ID, USERS.FirstName, USERS.LastName, USERS.Avatar, USERS.Nickname
										FROM USERS
										INNER JOIN FOLLOWERS ON FOLLOWERS.UserID_Follower = USERS.ID
										WHERE FOLLOWERS.ValidateFollow = '1' AND FOLLOWERS.UserID_Follower = ?;`)
	} else {
		fmt.Println("\nY A DE LA MERDE ICI : vérifie t'on option à la fonction ListFollow\n Option correct : 'followers' ou 'followings'")
		return
	}
	CheckErr(err, "ListFollowers, db prepare")
	rows, err := stmt.Query(UserID_Following)
	CheckErr(err, "ListFollowers, db query")
	for rows.Next() {
		var currentUser *User
		err = rows.Scan(&currentUser.Id, &currentUser.Firstname, &currentUser.Lastname, &currentUser.Avatar, &currentUser.Nickname)
		CheckErr(err, "ListFollowers, db rows.Next scan")
		listuser = append(listuser, *currentUser)
	}
	return listuser
}

func CheckErr(err error, str string) {
	if err != nil {
		fmt.Printf("______________________________________\nERROR : %v\n%v\n", str, err)
	}
}
