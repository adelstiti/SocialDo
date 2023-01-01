import React,{useState,useEffect} from 'react'
import {list} from './apiUser'
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.png'
import Loading from '../Loading'

const Users = () => {

    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        list().then(data =>{
            if(data.error){
                console.log(data.error);
                setLoading(false);
            }
            else{
                setUsers(data)
                setLoading(false);
            }
        })
          // eslint-disable-next-line
    }, [])
    
    return (

        <div className="container">
            <h2 className="mt-5 mb-5">Users</h2>
            {loading && <div style={{marginTop : "20vh"}} > <Loading /> </div>   }
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
                            <Link to={`/user/${user._id}`} className="btn btn-primary">View Profil</Link>
                        </div>
                    </div>

                    
                ))}
                

        </div>
    )
}

export default Users
