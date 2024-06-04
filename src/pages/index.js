import {useEffect} from 'react';
import {useRouter} from 'next/router';
import CreatePostForm from '../components/CreatePostForm';
import PostContainer from '../components/PostContainer';
import usePosts from '../services/usePosts';
import useComments from '../services/useComments';
import useUsers from '../services/useUsers';
import {conn, sendMsg} from '../services/useWebsocket';
import {TargetUsers} from "@/services/useTarget";


const Home = ({loggedIn, id}) => {
    const router = useRouter();
    const {posts, createPost, fetchPosts} = usePosts();
    const {comments, createComment} = useComments();
    const {users, fetchUsers} = useUsers();

    const onButtonClick = async () => {
        if (!loggedIn) {
            router.push('/login')
        }
    };

    useEffect(() => {
        if (loggedIn) {
            fetchPosts(id);
        }
    }, [loggedIn]);

    const handleCreatePost = async (formData) => {
        await createPost(formData);
        fetchPosts(id);

       /* console.log("formData", formData)
        console.log("formData privacy", formData.get('privacy'))
        console.log("formData selectedFollowers", formData.get('selectedFollowers'))*/

        let List = [];

        const selectedFollowers = formData.get('selectedFollowers');

        if (selectedFollowers) {
            List = selectedFollowers.split(',').map(Number);
        }

        switch (formData.get('privacy')) {
            case '1':
                sendMsg(conn, 0, {value: "New Post"}, 'post', TargetUsers)
                break
            case '2':
                sendMsg(conn, 0, {value: "New Post"}, 'post', List )
                break
            case '3':
                sendMsg(conn, 0, {value: "New Post"}, 'post', TargetUsers )
                break
            default:
                break
        }
    };

    const handleCreateComment = async (formData) => {
        await createComment(formData);
        fetchPosts(id);
        sendMsg(conn, 0, {value: "New Comment"}, 'comment')
    };

    const handlePostLike = async (postId) => {
        try {
            const response = await fetch('http://localhost:8080/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({post_id: postId}),
                credentials: 'include'
            });

            if (response.ok) {
                fetchPosts(id);
            } else {
                console.error('Failed to like the post:', response.statusText);
            }
        } catch (error) {
            console.error('Error while liking the post:', error);
        }
    };


    return (

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

            <>
                {loggedIn ? (
                        <>
                            <div className='test'>
                                <CreatePostForm handleCreatePost={handleCreatePost} fetchUsers={fetchUsers} id={id}
                                                users={users}/>
                                <PostContainer posts={posts} handleCreateComment={handleCreateComment}
                                               handlePostLike={handlePostLike}/>
                            </div>
                        </>
                    ) :
                    <div className="mainContainer">
                        <div className={'titleContainer'}>
                            <div>Welcome!</div>
                        </div>
                        <div>This is the home page.</div>
                        <div className={'buttonContainer'}>
                            <input
                                className={'inputButton'}
                                type="button"
                                onClick={onButtonClick}
                                value={'Log in'}
                            />
                            <div> You are not logged in</div>
                        </div>
                    </div>
                }
            </>

        </div>
    );
}

export default Home;
