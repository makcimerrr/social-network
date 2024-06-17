package pkg

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func GroupMessageHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/messagegroup" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}
	// Si GET on récupère l'historique des messages d'un chat.
	switch r.Method {
	case "GET":
		// On récupère le sender s = utilisateur connecté via sa session cookie.
		cookie, err := r.Cookie("session")
		if err != nil {
			return
		}
		foundVal := cookie.Value
		curr, err := CurrentUser(foundVal)
		if err != nil {
			return
		}
		s := strconv.Itoa(curr.Id)

		// On récupère le receiver r = id dans l'url quand on a cliqué sur son username.
		firstId, _ := strconv.Atoi(r.URL.Query().Get("firstId"))
		g := r.URL.Query().Get("group")

		// Récupération de tous les messages de la database en commun entre les deux users.
		messages, err := FindGroupChatMessages(s, g, firstId)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}

		// On retourne l'ensemble des messages.
		resp, err := json.Marshal(messages)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(resp)
	// Si POST, on envoit un message (écrit en fait dans la database, et il sera affiché par le GET au-dessus)
	case "POST":

		var newMessage Message
		fmt.Println(newMessage)
		// Décodage de la requête dans newMessage.
		err := json.NewDecoder(r.Body).Decode(&newMessage)
		if err != nil {
			http.Error(w, "400 bad request.", http.StatusBadRequest)
			return
		}

		// Appel de la fonction NewMessage (ci-dessous)
		err = NewGroupMessage(newMessage)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

// Création d'un nouveau message.
func NewGroupMessage(m Message) error {
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()
	fmt.Println(m)
	result, err := db.Exec(`INSERT INTO groupmessages(sender_id, group_id, content, date) values(?, ?, ?, ?)`, m.Sender_id, m.Receiver_id, m.Content, m.Date)
	if err != nil {
		return err
	}

	dt := time.Now().Format("01-02-2006 15:04:05")

	idMessage, err := result.LastInsertId()
	if err != nil {
		return err
	}

	groupID := m.Receiver_id // Supposant que Receiver_id est l'ID du groupe
	listUser := WhoDisplayNotif(m.Sender_id, groupID, "groupmessage", db)

	// fmt.Println(listUser)
	// fmt.Println(dt)
	// fmt.Println(idMessage)

	for _, user := range listUser {
		InsertNotif(int(idMessage), user.Id, dt, "groupmsg", db)
	}

	return nil
}

// Récupération de tous les messages de la database en commun entre 2 users donnés.
func FindGroupChatMessages(sender, group string, firstId int) ([]Message, error) {
	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
	}
	defer db.Close()
	g, err := strconv.Atoi(group)
	if err != nil {
		return []Message{}, errors.New("receiver id must be an integer")
	}

	// q, err := db.Query(`SELECT * FROM groupmessages WHERE group_id = ? ORDER BY id DESC LIMIT 10`, g, firstId)
	q, err := db.Query(`SELECT groupmessages.id, groupmessages.sender_id, groupmessages.content, groupmessages.date,
						USERS.FirstName, USERS.LastName, USERS.Nickname
						FROM groupmessages 
						INNER JOIN USERS ON groupmessages.sender_id = USERS.id
						WHERE group_id = ? 
						ORDER BY id DESC LIMIT 10;`, g, firstId)

	if err != nil {
		return []Message{}, errors.New("could not find chat messages")
	}

	messages, err := ConvertRowToGroupMessage(q)
	if err != nil {
		return []Message{}, errors.New("failed to convert")
	}

	return messages, nil
}

// find the last message between two users
// func FindGroupLastMessage(sender, receiver string) (Message, error) {
// 	// Opens the database
// 	db, err := sql.Open("sqlite3", "backend/pkg/db/database.db")
// 	if err != nil {
// 		fmt.Println("Erreur lors de l'ouverture de la base de données:", err)
// 	}
// 	defer db.Close()

// 	// Converts sender and receiver ids to integers
// 	s, err := strconv.Atoi(sender)
// 	if err != nil {
// 		return Message{}, errors.New("sender id must be an integer")
// 	}

// 	r, err := strconv.Atoi(receiver)
// 	if err != nil {
// 		return Message{}, errors.New("receiver id must be an integer")
// 	}

// 	// search database for last message between the two users
// 	q, err := db.Query(`SELECT * FROM groupmessages WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) ORDER BY id DESC LIMIT 1`, r, r, r, s)
// 	if err != nil {
// 		return Message{}, errors.New("could not find chat messages")
// 	}

// 	// Converts rows to an array of message structs
// 	messages, err := ConvertRowToGroupMessage(q)
// 	if err != nil {
// 		return Message{}, errors.New("failed to convert")
// 	}

// 	return messages[0], nil
// }

// Mise en forme des rows en une array de structures Message.
func ConvertRowToGroupMessage(rows *sql.Rows) ([]Message, error) {
	var messages []Message
	var firstName, lastName, nickname string
	for rows.Next() {
		var m Message
		err := rows.Scan(&m.Id, &m.Sender_id, &m.Content, &m.Date, &firstName, &lastName, &nickname)
		if err != nil {
			break
		}
		if nickname != "" {
			m.Sender_nickname = nickname
		} else {
			m.Sender_nickname = firstName + " " + lastName
		}
		messages = append(messages, m)
	}
	return messages, nil
}

/* q, err := db.Query(`SELECT groupmessages.id, groupmessages.sender_id, groupmessages.content,
USERS.FirstName, USERS.LastName, USERS.Nickname
FROM groupmessages
INNER JOIN USERS ON groupmessages.sender_id = USERS.id
WHERE group_id = ?
ORDER BY id DESC LIMIT 10;`, g, firstId) */
