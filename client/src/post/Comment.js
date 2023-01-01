import React,{useState} from 'react'
import {comment,uncomment} from './apiPost'
import {isAuthenticate} from '../auth'
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.png'
import TimeAgo from 'react-timeago'

const Comment = (props) => {

    const [text, setText] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setText(e.target.value)
    }

    const addComment = (e) =>{
        e.preventDefault();
        if( !isAuthenticate() ){
            setError("Please Signin to leave a comment")
            return false
       }
        if(isValid()){
            const userId = isAuthenticate().user._id ;
            const token = isAuthenticate().token ;
            const postId = props.postId ;
            comment(userId,token,postId,{text : text})
            .then(data => {
                if(data.error){
                    setError(data.error);
                    console.log(error);
                }else{
                    setText('');
                    // t3adi el comments
                    props.updateComments(data.comments)
                }
            })
        }

    }

    const deleteComment = (comment) => {
        const userId =isAuthenticate().user._id ; 
        const token =isAuthenticate().token ; 
        const postId = props.postId ;
        uncomment(userId,token,postId,comment)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                props.updateComments(data.comments)
            }
        })
    }

    const deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure you want to delete this comment !!")
        if(answer){
            deleteComment(comment);
        }
    }

    const renderPosts = (comments) =>{
        return (
            comments.map((commentaire,i) => {
                console.log(commentaire);
                const whocomId = commentaire.postedBy ? commentaire.postedBy._id : "";
                const whocomName = commentaire.postedBy ? commentaire.postedBy.name : "";
                 return (
                    <div className="card mb-5" key={i}> 
                        <div className="card-header p-0 pl-2 bg-light">
                        <Link to={`/user/${whocomId}`} className=" row ml-2">
                                    <img  className="float-left mr-2 rounded-circle"  onError={i =>  (i.target.src = `${DefaultProfile}`)  }
                                        src={`${  process.env.REACT_APP_API_URL  }/user/photo/${whocomId}`}  alt={whocomName} 
                                        width="40px" height="40px"/>
                                    <div>
                                        <p className="lead  mt-1">  {whocomName}  </p>
                                    </div>
                                </Link>
                        </div>

                        <div className="card-body">
                            <p className="card-text font-weight-normal ">{commentaire.text} </p>
                            <small className="text-muted"> Created <TimeAgo date={commentaire.created}  />  </small>
                            {(isAuthenticate().user && whocomId === isAuthenticate().user._id ) && 
                              <i className="far fa-trash-alt float-right text-danger fa-lg mr-2"  style={{cursor: 'pointer'}} onClick={() => deleteConfirmed(commentaire)}></i>
                              } 
                        </div>
        
                    </div>
                 )
            })
        )
    }

    const isValid = () => {
        if (text.length === 0) {
            setError("Comment should be not empty")
          return false;
        }
        
        if (text.length > 150) {
            setError("Comment should less than 150 characters long")
          return false;
        }

        return true;
      };

    if(error){
        setTimeout(() => {
            setError('');
          },5000);
    }
    
   const commentairs = props.comments ;
    return (
        <div className="container">
            <h2 className="mt-5 mb-4">Leave a Comment</h2>
            <form onSubmit={addComment}>
                {error &&  
                 <div className={`alert alert-danger`}>
                 <i className="fas fa-info-circle" /> {error}
                 </div>
                }
                <div className="form-group">
                        <input type="text" className="form-control" name="comment" onChange={handleChange} value={text} placeholder="Leave a comment..." />
                </div>
                <button className="btn btn-raised btn-dark ">Comment</button>
            </form>
           <div className="mt-5">
           {commentairs.length ? 
            <div>
                <h3 className="text-primary">  {commentairs.length } Comments </h3>  <hr className="mb-3"/>
            </div>
            :
            ''
           } 
            {renderPosts(commentairs)}          
         </div>
        </div>
    )
}

export default Comment
