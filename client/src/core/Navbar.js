import React from 'react'
import {Link,withRouter} from 'react-router-dom'
import {signout,isAuthenticate} from '../auth'

const isActive = (history,path) => {
    if(history.location.pathname === path) return{color:"#009688"}
    else return {color : "rgba(0,0,0,.5)"}
}


const Navbar = ({history}) => {
    return (
        <>
        
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/" ><img src="./images/logo.png" width="30" height="30" alt=""/> SocialGo
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item ">
                        <Link to='/' className="nav-link" style={isActive(history,"/")}>Home </Link>
                        </li>

                        <li className="nav-item ">
                        <Link to='/users' className="nav-link" style={isActive(history,"/users")}>Users </Link>
                        </li>

                        {!isAuthenticate() ? 
                            <>
                                <li className="nav-item">
                                <Link to='/signin' className="nav-link" style={isActive(history,"/signin")} >Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/signup' className="nav-link" style={isActive(history,"/signup")} >Sign Up</Link>  
                                </li>
                            </>
                        :
                            <>
                             <li className="nav-item">
                                    <Link to='/findpeople' className="nav-link" style={isActive(history,"/findpeople")} >Find</Link>  
                            </li>
                            <li className="nav-item">
                                    <Link to='/post/create' className="nav-link" style={isActive(history,"/post/create")} >New Post</Link>  
                                </li>
                            <li className="nav-item">
                                <Link to={`/user/${isAuthenticate().user._id}`}  className="nav-link" style={isActive(history,`/user/${isAuthenticate().user._id}`)}>
                                {isAuthenticate().user.name}'s Profile
                                </Link>
                            </li>
                            </>
                        }

                    </ul>    
                    {isAuthenticate() &&  
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <a href='/' className="nav-link" onClick={() => signout(() => history.push('/'))} >Sign OUT</a>  
                        </li>
                    </ul>  
                    }    
                </div>
            </nav>  
        </>

    )
}

export default withRouter(Navbar)
