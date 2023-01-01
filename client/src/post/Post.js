import React,{useState,useEffect} from 'react'
import {isAuthenticate} from '../auth'
import {Redirect,Link} from 'react-router-dom'
import {readPost,deletePost,getLike,unlike} from './apiPost'
import DefaultPostPic from '../images/cover.jpg'
import Loading from '../Loading'
import EditPost from './EditPost'
import Comment from './Comment'
const Post = (props) => {

    const [post,setPost] = useState("");
    const [comments,setComments] = useState([]);
    const [error,setError] = useState("");
    const [redirectToSign,setRedirectToSign] = useState(false);
    const [loading,setLoading] = useState(true);
    const [itlike,setItlike] = useState(false);
    const [likes,setLikes] = useState(0);

    const photoUrl = post.photo ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}` : DefaultPostPic ;

    const posterName = post.postedBy ? post.postedBy.name : "";
    const posterId = post.postedBy ? post.postedBy._id : "";
    const DatePost = new Date(post.created).toString().substring(0,21);


    // check Like  
    const checkLike = likes => {
        const userId =  isAuthenticate() &&  isAuthenticate().user._id ;
        const match = likes.indexOf(userId) !== -1 ;
        return match ;
    }

    useEffect(() =>{
        const postId = props.match.params.postId ;
        intit(postId)

     // eslint-disable-next-line
    },[]);

    const intit = (postId) => {
        readPost(postId)
        .then(data => {
            if(data.error){
                setError(data.error);
                setLoading(false);
            }
            else{
                setPost(data)
                setLikes(data.likes.length)
                setItlike(checkLike(data.likes))
                setLoading(false);
                setComments(data.comments)
            }
        })
    }
    const deleteAccount = () => {
        const token =isAuthenticate().token ; 
        const postId = props.match.params.postId ;
        deletePost(postId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
                setLoading(false);
            }else{
                setLoading(false);
            }
        })
    }

    const deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your post !!")
        if(answer){
            setLoading(true);
            deleteAccount();
        }
    }

    const likeToogle = () => {
        if( !isAuthenticate() ){
            setRedirectToSign(true)
            return false
       }
        let callApi = itlike ? unlike : getLike ;
        const userId = isAuthenticate().user._id ;
        const token = isAuthenticate().token ;
        const postId = props.match.params.postId ;
        callApi(userId,token,postId)
        .then(data => {
            if(data.error){
                setError(data.error);
                console.log(error);
            }else{
                setLikes(data.likes.length)
                setItlike(!itlike)
            }
        })
    }
    
    const updateComments = comments => {
        setComments(comments);
    }

    if(redirectToSign){
        return <Redirect to="/signin" />
    }

    const returnrek = () => {
        return(
            <>
            <header className="text-light mb-5 " style={{background: `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,1)), url(${photoUrl}) no-repeat center center /cover` }} >
                <div className="container p-5 ">
                <div className="p-4 m-5">
                        <div className="post-heading">
                            <h1 className="pb-3">{post.title}</h1>
                            <span className="meta">Posted by 
                            <Link to={`/user/${posterId}`} >{" "+posterName+" "} </Link>
                            </span>
                            <p className="meta">on {DatePost} </p>
                    </div>
                </div>
                </div>
            </header>

            <article>
                <div className="container">
                    {itlike ?
                    <h5 className="btn btn-raised btn-Secondary mb-3" style={{color: "#009688"}} onClick={likeToogle} ><i className="fas fa-thumbs-up"></i> {likes} Likes </h5>
                    :
                    <h5 className="btn btn-raised btn-outline-primary mb-3" style={{color: "#009688"}}  onClick={likeToogle} ><i className="far fa-thumbs-up"></i>  {likes} Likes </h5>}
                    <div className=" mx-auto">
                        {post.body}
                    </div>

                </div>
            </article>
            <hr/>

            <div className="container">
            <Link to={`/`} className="btn btn-primary btn-raised btn-sm mr-4 ">BACK TO POSTS</Link> 

            {(isAuthenticate().user && posterId === isAuthenticate().user._id ) && 
            <>
                <a href='.EditPostmodal' data-toggle="modal" className="btn btn-secondary btn-raised btn-sm mr-4 ">Update Post</a> 
                <Link to={`/user/${posterId}`} className="btn btn-danger btn-raised btn-sm" onClick={deleteConfirmed}>Delete Post</Link> 

                <EditPost post={post} setPost={setPost}/>

            </>} 
            </div>
            <Comment postId={post._id} comments={comments.reverse()} updateComments={updateComments} />
        </>
        )
    }

    return (
        <>
        { loading ? <div style={{marginTop : "20vh"}} > <Loading /> </div> : returnrek()}

        </>

    )
}

export default Post
