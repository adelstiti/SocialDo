import React,{useState,useEffect} from 'react'
import {findPeople, follow} from './apiUser'
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.png'
import {isAuthenticate} from '../auth'

const FindPeople = () => {

    const [users,setUsers] = useState([]);
    const [error,setError] = useState("");
    const [open,setOpen] = useState(false);
    const [msg,setMsg] = useState("");

    useEffect(() => {
        findPeople(usertoken().userId,usertoken().token).then(data =>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setUsers(data)
            }
        })
          // eslint-disable-next-line
    }, [])
    
   const usertoken = () => {

        const userId = isAuthenticate().user._id;
        const token = isAuthenticate().token;
        const user = {userId,token}
        return user;
    }

    const clickFollow = (user,i) => {
        const userId = isAuthenticate().user._id;
        const token = isAuthenticate().token;
        follow(userId,token,user._id)
        .then(data => { 
            if(data.error){
                setError(data.error);
             } else{
                 let tofollow = users ;
                 tofollow.splice(i,1);
                setUsers(tofollow)
                setOpen(true)
                setMsg(`Following ${user.name}`)
             }
            })
    }

    if(open){
        setTimeout(() => {
            setOpen(false);
          },3000);
    }

    
    if(error){
        setTimeout(() => {
            setError('');
          },3000);
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Find People</h2>
            {open &&  
                 <div className={`alert alert-success`}>
                 <i className="fas fa-info-circle" /> {msg}
                 </div>
            }
            {error &&  
                 <div className={`alert alert-danger`}>
                 <i className="fas fa-info-circle" /> {error}
                 </div>
            }
            {users.map((user,i) => (
                        <div className="card m-3 d-inline-flex" style={{width: "18rem"}} key={i}> 
                        <img className="card-img-top  " 
                            src={ user.photo ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile} 
                            onError={i =>{i.target.src = DefaultProfile}}
                            alt={user.name} 
                            style={{width: "100%" , height:"15vw",objectFit:"cover"}} 
                            />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">View Profil</Link>
                            <button className="btn btn-raised btn-info float-right btn-sm" onClick={() => clickFollow(user,i)}> Follow
                            </button>                       
                        </div>
                    </div>

                    
                ))}
                

        </div>
    )
}

export default FindPeople
