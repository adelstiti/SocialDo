import React,{useState,useEffect} from 'react'
import {list} from './apiPost'
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.png'
import DefaultcoverPost from '../images/cover.jpg'
import TimeAgo from 'react-timeago'
import Loading from '../Loading'

const Posts = () => {

    const [posts,setPosts] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        list().then(data =>{
            if(data?.error){
                console.log(data.error);
                setLoading(false);
            }
            else{
                setPosts(data ?? [])
                setLoading(false);
            }
        })
          // eslint-disable-next-line
    }, [])
    const renderPosts = (posts) =>{
            return (
                posts.map((post,i) => {
                    const posterId = post.postedBy ? post.postedBy._id : "";
                    const posterName = post.postedBy ? post.postedBy.name : "";
                     return (
                        <div className="card mb-5" key={i}> 
                            <div className="card-header p-0 pt-2 pl-2 bg-light">
                            <Link to={`/user/${posterId}`} className=" row ml-2">
                                        <img  className="float-left mr-2 rounded-circle"  onError={i =>  (i.target.src = `${DefaultProfile}`)  }
                                            src={post.photo ? `${process.env.REACT_APP_API_URL}/user/photo/${posterId}?${new Date().getTime()}`  : DefaultProfile}  
                                            alt={posterName} 
                                            width="40px" height="40px"/>
                                        <div>
                                            <p className="lead  mt-1">  {posterName}  </p>
                                        </div>
                                    </Link>
                            </div>

                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text font-weight-normal text-secondary">{post.body.substring(0,75)}
                                    <Link to={`/post/${post._id}`} className="btn btn-primary ml-1 mt-1 btn-sm  ">Read More</Link>
                                </p>
                                <p className="card-text">
                                {post.updated ?  
                                    <small className="text-muted"> Last updated <TimeAgo date={post.updated}  /> 
                                    </small>
                                    :
                                    <small className="text-muted"> Created <TimeAgo date={post.created}  /> 
                                    </small>
                                }
                                </p>
                                <img className="card-img-bottom"  
                                src={ post.photo ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}` : DefaultcoverPost} 
                                            onError={i =>{i.target.src = DefaultcoverPost}}
                                            alt={post.name} 
                                            style={{width: "100%" , height:"15vw",objectFit:"cover"}}
                                /> 
                            </div>
            
                        </div>
                     )
                })
            )
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Recent Posts</h2>
            { loading ? <div style={{marginTop : "20vh"}} > <Loading /> </div> : renderPosts(posts)    }

        </div>
    )
}

export default Posts
