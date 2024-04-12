package pkg

type User struct { //Sert a Register et le profil
	Id              int    `json:"id"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	Firstname       string `json:"firstname"`
	Lastname        string `json:"lastname"`
	DateOfBirth     string `json:"dateofbirth"`
	Avatar          []byte `json:"avatar"` // A revoir
	Nickname        string `json:"nickname"`
	AboutMe         string `json:"aboutme"`
	PrivateProfile  string `json:"privateprofile"`
	PointOfInterest string `json:"pointofinterest"` //Join variables
}
type Session struct {
	Session_uuid string
	User_id      int
}
type Post struct {
	Id         int    `json:"id"`
	User_id    int    `json:"user_id"`
	Title      string `json:"title"`
	Content    string `json:"content"`
	Date       string `json:"date"`
	Likes      int    `json:"likes"`
	Private    int    `json:"privacy"`
	Image      []byte `json:"image"`
	NbComments int    `json:"nbcomments"`
}
type Comment struct {
	Id      int    `json:"id"`
	Post_id int    `json:"post_id"`
	User_id int    `json:"user_id"`
	Content string `json:"content"`
	Date    string `json:"date"`
	Image   []byte `json:"image"`
}
type Login struct {
	Data     string `json:"data"`
	Password string `json:"password"`
}
type Followers struct {
	UserId_Following int    `json:"userid_following"`
	UserId_Follower  int    `json:"userid_follower"`
	DateFollow       string `json:"datefollow"`
	ValidateFollow   bool   `json:"validatefollow"`
}

type Resp struct {
	Msg string `json:"msg"`
}

type Like struct {
	ID      int  `json:"id"`
	User_id int  `json:"user_id"`
	Post_Id int  `json:"post_id"`
	Like    bool `json:"liked"`
}
