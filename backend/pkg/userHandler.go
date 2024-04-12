package pkg

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/user" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	// On ne veut que une requête GET (usage getUsers dans index.js).
	if r.Method != "GET" {
		http.Error(w, "405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	// On check dans la présence d'un param id dans l'url.
	id := r.URL.Query().Get("id")
	// Si aucun id, on récupère l'ensemble des users de la database.
	if id == "" {
		users, err := FindAllUsers()
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
		// On renvoit une array de structures users.
		resp, err := json.Marshal(users)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(resp)
		// Sinon on recherche un user par son id.
	} else {
		user, err := FindUserByParam("id", id)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
		// On renvoit la structure user recherchée.
		resp, err := json.Marshal(user)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(resp)
	}
}

// Récupération de tous les users de la database.
func FindAllUsers() ([]User, error) {
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM USERS ORDER BY Nickname ASC`)
	if err != nil {
		return []User{}, errors.New("failed to find users")
	}

	users, err := ConvertRowToUser(rows)
	if err != nil {
		return []User{}, errors.New("failed to convert")
	}

	return users, nil
}

// Récupération d'un user en fonction d'un paramètre, exemple id.
func FindUserByParam(parameter, data string) (User, error) {
	var q *sql.Rows
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()

	switch parameter {
	case "id":
		i, err := strconv.Atoi(data)
		if err != nil {
			return User{}, errors.New("id must be an integer")
		}
		q, err = db.Query(`SELECT * FROM USERS WHERE ID = ?`, i)
		if err != nil {
			return User{}, errors.New("could not find id")
		}
	case "username":
		q, err = db.Query(`SELECT * FROM USERS WHERE Nickname = ?`, data)
		if err != nil {
			return User{}, errors.New("could not find username")
		}
	case "email":
		q, err = db.Query(`SELECT * FROM USERS WHERE Email = ?`, data)
		if err != nil {
			return User{}, errors.New("could not find email")
		}
	default:
		return User{}, errors.New("cannot search by that parameter")
	}

	user, err := ConvertRowToUser(q)
	if err != nil {
		return User{}, errors.New("failed to convert")
	}

	return user[0], nil
}

// Retourne l'user qui est loggé et dispose d'une session cookie valide.
func CurrentUser(val string) (User, error) {
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()

	q, err := db.Query(`SELECT UserID FROM SESSIONS WHERE SessionToken = ?`, val)
	if err != nil {
		fmt.Println("error")
		return User{}, err
	}

	users, err := ConvertRowToUser(q)
	if err != nil {
		return User{}, err
	}
	if len(users) == 0 {
		fmt.Println("no user")
		return User{}, errors.New("no user found")
	}
	return users[0], nil
}

// Mise en forme des rows en une array de structures User.
func ConvertRowToUser(rows *sql.Rows) ([]User, error) {
	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.Id)
		if err != nil {
			break
		}
		users = append(users, u)
	}
	return users, nil
}
