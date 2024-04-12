package pkg

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gofrs/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var loginData Login
	if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var trueEmail string
	var truePassword string
	var username string
	var id int
	var err error

	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
		return
	}
	defer db.Close()

	fmt.Println(loginData.Data)

	if strings.Contains(loginData.Data, "@") {
		// Si loginData contient un "@", alors c'est un email
		loginEmail := loginData.Data
		err = db.QueryRow("SELECT ID, Nickname, Email, Password FROM USERS WHERE Email = ?", loginEmail).Scan(&id, &username, &trueEmail, &truePassword)
		if err != nil {
			fmt.Println("Erreur lors de la récupération des données de l'utilisateur par email:", err) //Existe pas
		}
	} else {
		// Sinon, c'est un nom d'utilisateur
		loginUsername := loginData.Data
		err = db.QueryRow("SELECT ID, Nickname, Email, Password FROM USERS WHERE Nickname = ?", loginUsername).Scan(&id, &username, &trueEmail, &truePassword)
		if err != nil {
			fmt.Println("Erreur2 lors de la récupération des données de l'utilisateur par nom d'utilisateur:", err) //Existe pas
		}
	}

	if err != nil {
		jsonResponse := map[string]interface{}{
			"success": false,
			"message": "Email ou username incorrect",
			"error":   "email",
		}
		err := json.NewEncoder(w).Encode(jsonResponse)
		if err != nil {
			return
		}
	} else {
		if truePassword != loginData.Password {
			jsonResponse := map[string]interface{}{
				"success": false,
				"message": "Mot de passe incorrect",
				"error":   "password",
			}
			err := json.NewEncoder(w).Encode(jsonResponse)
			if err != nil {
				return
			}
		} else {
			// Delete si cookie existant.
			_, err = db.Exec(`DELETE FROM SESSIONS WHERE UserID = ?`, id)
			if err != nil {
				fmt.Println("error cookie supp")
				http.Error(w, "500 internal server error.", http.StatusInternalServerError)
				return
			}

			// Création d'une session et cookie avec protocole UUID.
			cookie, err := r.Cookie("session")
			if err != nil {
				sessionId, err := uuid.NewV4()
				if err != nil {
					fmt.Println("error cookie crea")
					http.Error(w, "500 internal server error.", http.StatusInternalServerError)
					return
				}
				cookie = &http.Cookie{
					Name:     "session",
					Value:    sessionId.String(),
					HttpOnly: true,
					Path:     "/",
					MaxAge:   60 * 60 * 24,
					SameSite: http.SameSiteNoneMode,
					Secure:   true,
				}
				http.SetCookie(w, cookie)
			}
			_, err = db.Exec(`INSERT INTO SESSIONS (SessionToken, UserID) values(?, ?)`, cookie.Value, id)
			if err != nil {
				fmt.Println("error DB cookie")
				http.Error(w, "500 internal server error.", http.StatusInternalServerError)
				return
			}
			/*postDataLogin := WebsocketMessage{Type: "login", Data: UserData}
			broadcast <- postDataLogin*/
			jsonResponse := map[string]interface{}{
				"success":  true,
				"message":  "Connexion spécie",
				"email":    trueEmail,
				"username": username,
			}
			err = json.NewEncoder(w).Encode(jsonResponse)
			if err != nil {
				return
			}
		}
	}
}
