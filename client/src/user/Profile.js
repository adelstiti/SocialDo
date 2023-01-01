import React,{useState,useEffect} from 'react'
import {isAuthenticate} from '../auth'
import {Link,Redirect,withRouter} from 'react-router-dom'
import {read} from './apiUser'
import {listbyUserId} from '../post/apiPost'
import DefaultProfile from '../images/avatar.png'
import DeleteUser from './DeleteUser'
import EditProfile from './EditProfile'
import FollowButton from './FollowButton'
import ProfileTabs from './ProfileTabs'

const Profile = (props) => {

    const [posts,setPosts] = useState([]);
    const [user,setUser] = useState("");
    const [error,setError] = useState("");
    const [following,setFollowing] = useState(false);
    const [redirecttoSignin,setRedirecttoSignin] = useState(false);
  
    // check follow  
    const checkFollow = user => {
        const jwt = isAuthenticate() ;
        const match = user.followers.find(follower => {
             // If USER FOLLOWERS MAWJOUD FIHOM ANA
            return follower._id === jwt.user._id ;
        })
        return match ;
    }
    
    const clickFollowButton = callApi => {
        const userId = isAuthenticate().user._id ;
        const token = isAuthenticate().token ;
        callApi(userId,token,user._id)
        .then(data => {
            if(data.error){
                setError(data.error);
                console.log(error);
            }else{
                setUser(data.result)
                setFollowing(!following)
            }
        })
    }

    const intit = (userId) => {
        const token = isAuthenticate().token ;
        read(userId,token)
        .then(data => {
            if(data.error){
                setError(data.error);
                setRedirecttoSignin(true)
                console.log(error);
            }
            else{
                setFollowing(checkFollow(data))
                setUser(data)
                loadPosts(data._id)
            }
        })
    }

    useEffect(() =>{
        const userId = props.match.params.userId ;
        intit(userId)

     // eslint-disable-next-line
    },[]);

    const loadPosts = (userId) => {
        const token = isAuthenticate().token ;
        listbyUserId(userId,token)
        .then(data => {
            if(data.error){
                setError(data.error);
                setRedirecttoSignin(true)
            }
            else{
                setPosts(data)
            }
        })
    }
    
    if(!isAuthenticate()){
        return <Redirect to="/signin" />
    }

    if(redirecttoSignin) {
        return <Redirect to="/signin" />
    }

    const photoUrl = user.photo ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`  : DefaultProfile ;

    return (

        <div className="container">
            <h2 className="mt-5 mb-5">Profile</h2>
            <div className="row">
                <div className="col-md-6">
                    <img className="card-img-top w-50 img-thumbnail" 
                    onError={i =>{i.target.src = DefaultProfile}}
                            src={photoUrl}
                            alt={user.name} 

                            />
                </div>
                <div className="col-md-6">
                    <div className="lead m-2">
                        <p>Hello {user.name}</p>
                        <p>Email  : {user.email}</p>
                        <p>Joined  : {new Date(user.created).toDateString()}</p>
                   </div>

                    { (isAuthenticate().user && user._id === isAuthenticate().user._id ) ? (
                    <div className="d-inline-block ">
                        <Link to="/post/create" className="btn btn-raised btn-info mr-5">Create Post
                        </Link>
                        <a 
                            href=".Editmodal" 
                            className="btn btn-raised btn-success mr-5"
                            data-toggle="modal" 
                            >Edit</a>

                        <EditProfile user={user} token={isAuthenticate().token} setUser={setUser}/>

                      <DeleteUser userId={user._id}/>
                    </div>
                    ):
                    <FollowButton following={following} onButtonClick={clickFollowButton}/>

                    }
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 mt-5 b-5 text-center">
                    {user.about &&  
                    <>
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr /> 
                    </>
                    }
                <ProfileTabs followers={user.followers} following={user.following} posts={posts} />
                </div>
            </div>
        </div>
    )
}

export default withRouter(Profile)
