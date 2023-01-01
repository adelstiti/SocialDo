import React,{useState} from 'react'
import {signout,isAuthenticate} from '../auth'
import {Redirect} from 'react-router-dom'
import {remove} from './apiUser'
import Loading from '../Loading'

const DeleteUser = (props) => {

    const [redirectToReferer,setRedirectToReferer] = useState(false);
    const [loading,setLoading] = useState(false);
    
    const deleteAccount = () => {
        const token = isAuthenticate().token ; 
        const userId = props.userId ;
        remove(userId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
                setLoading(false);
            }else{
                signout(() => console.log('Acccont deleted'))
                setLoading(false);
                setRedirectToReferer(true)
            }
        })
    }

    const deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account !!")
        if(answer){
            setLoading(true);
            deleteAccount();
        }
    }

    if(redirectToReferer){
        return <Redirect to="/" />
    }

    return (
        <>
        <button onClick={deleteConfirmed} className="btn btn-raised btn-danger">
            Delete Profile
        </button>  
        { loading && 
            <Loading />
        }
        </>
         
    )

}

export default DeleteUser
