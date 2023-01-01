import React from 'react'
import Posts from '../post/Posts'
const Home = () => {
    return (
        <div>
            <div className="jumbotron">
                <h2>Home</h2>
                <p className="lead">Welecome to React Frontend</p>
            </div>
            <Posts />
        </div>
    )
}

export default Home
