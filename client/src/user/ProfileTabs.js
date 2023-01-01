import React,{useState} from 'react'
import DefaultProfile from '../images/avatar.png'
import {NavLink,withRouter} from 'react-router-dom'
import DefaultcoverPost from '../images/cover.jpg'
import TimeAgo from 'react-timeago'

const ProfileTabs = (props) => {

    const {following,followers,posts} = props ;
    const postsa = posts.posts
    const [verb,setVerb] = useState(false);

    const showFollowing = () => {
        return(
                        following && following.map((person, i) => (
                                <div key={i} className="d-flex justify-content-center" >
                                    <NavLink to={`/user/${person._id}`} className="row mb-2">
                                        <img  className="float-left mr-2 rounded-circle"  
                                        onError={i =>{i.target.src = DefaultProfile}}
                                        src={`${  process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} 
                                            width="60px" height="60px"/>
                                        <div>
                                            <p className="lead  mt-3">  {person.name}  </p>
                                        </div>
                                    </NavLink>
                                </div>
                        ))
        )
    }

    
    const showFollowers = () => {
        return(
            followers && followers.map((person, i) => (
                <div key={i} className="d-flex justify-content-center" >
                 <NavLink to={`/user/${person._id}`} className="row mb-3">
                     <img  className="float-left mr-2 rounded-circle"  
                        onError={i =>{i.target.src = DefaultProfile}}
                        src={`${  process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} 
                         width="60px" height="60px"/>
                         <div>
                             <p className="lead  mt-3">  {person.name}  </p>
                         </div>
                 </NavLink>
              </div>
             ))
        )
    }
    

    return (
            <div>
                <div className="row">
                    <div className="col-md-8 text-left">
                        <h3 className="text-primary">Posts</h3>
                        <hr />
                        {postsa && postsa.map((post, i) => (
                                <div className="card mb-5" key={i}> 
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text font-weight-normal text-secondary">{post.body.substring(0,75)}
                                        <NavLink to={`/post/${post._id}`} className="btn btn-primary ml-1 mt-1 btn-sm  ">Read More</NavLink>
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
                        ))
                    }
                    </div>

                    <div className="col-md-4">
                    <h6 className={"d-inline mr-5 "+ (verb ? 'text-dark' : 'text-primary') } onClick={() => setVerb(false)} style={{cursor: 'pointer'}}> Followers</h6>
                    <h6 className={"d-inline "+ (verb ? 'text-primary' : 'text-dark') } onClick={() => setVerb(true)} style={{cursor: 'pointer'}} > Followings</h6>
                        <hr />
                        { verb ? showFollowing(): showFollowers()}  
                    </div>
       

       
                </div>
        </div>
    )
}

export default withRouter(ProfileTabs)
