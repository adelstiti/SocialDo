import React from 'react'
import {Route,Switch} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Navbar from './core/Navbar'
import Profile from './user/Profile'
import Users from './user/Users'
import PrivateRoute from './auth/PrivateRoute'
import FindPeople from './user/FindPeople'
import NewPost from './post/NewPost'
import Post from './post/Post'
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => {
    return (
        <div>
            <Navbar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route   path="/reset-password/:resetPasswordToken" component={ResetPassword} />
                <PrivateRoute  path="/post/create" component={NewPost}/>
                <Route  path="/post/:postId" component={Post}/>
                <Route  path="/users" component={Users}/>
                <Route  path="/signup" component={Signup}/>
                <Route  path="/signin" component={Signin}/>
                <PrivateRoute  path="/findpeople" component={FindPeople}/>
                <Route exact  path="/user/:userId" render={props => <Profile key={Date.now()}  {...props} />} />
            </Switch>
        </div>
    )
}

export default MainRouter
