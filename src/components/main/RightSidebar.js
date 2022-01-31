//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//RightSidebar.js is the component that contains the log out button as well as a link to the current user's profile

import React from 'react';
import UserThumbnail from '../thumbnails/UserThumbnail';

function RightSidebar(props) {

    return(

        <div className="w-100">
            <ul className="list-group">
                <button type="button" className="btn btn-outline-primary w-100 mt-2" onClick={props.logoutCallback}>Log out</button>

                <UserThumbnail userId={props.userInfo._id} key={props.userInfo._id}/>

            </ul>
        </div>
    )
    
} 

export default RightSidebar;