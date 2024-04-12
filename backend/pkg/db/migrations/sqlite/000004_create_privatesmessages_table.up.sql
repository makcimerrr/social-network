CREATE TABLE IF NOT EXISTS PRIVATEMESSAGE
(
    IDMessage
    INTEGER
    PRIMARY
    KEY,
    UserID_Sender
    INTEGER,
    UserID_Receiver
    INTEGER,
    Date
    TEXT,
    ContentMessage
    TEXT,
    Image
    BLOB,
    FOREIGN
    KEY
(
    UserID_Sender
) REFERENCES USERS
(
    ID
),
    FOREIGN KEY
(
    UserID_Receiver
) REFERENCES USERS
(
    ID
)
    );