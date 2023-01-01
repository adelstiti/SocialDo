import React from 'react'
import {follow,unfollow} from './apiUser'

const FollowButton = (props) => {
    
    const followClick = () => {
        props.onButtonClick(follow);
    }
    const unfollowClick = () => {
        props.onButtonClick(unfollow);
    }

    return (
        <div className="d-inline-block ">
            {props.following ? 
                <button className="btn btn-warning btn-raised " onClick={unfollowClick}> Unollow</button>
            :
                <button className="btn btn-success btn-raised mr-5" onClick={followClick}> Follow</button>
            }
        </div>
    )
}

export default FollowButton
