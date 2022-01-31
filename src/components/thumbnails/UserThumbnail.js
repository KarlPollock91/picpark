//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//UserThumbnail.js is a component that displays a username, avatar and provides options to visit the View Profile or Main
//components for the user.

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Dropdown, DropdownButton} from 'react-bootstrap';

import Avatar from '../thumbnails/Avatar';
import Loading from '../secondary/Loading';
import '../css/Thumbnail.css';

import * as Constants from '../../utils/constants';

function UserThumbnail(props) {

    const [profile, setProfile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [serverPermission, setServerPermission] = useState(null);
    const navigate = useNavigate();
    

   //Component hook to retrieve the user profile.
    useEffect(() => {
        if (props.userId != null) {
            axios.get(`${Constants.SERVER_URL}/accounts/getUser/${props.userId}`, {headers: 
                {
                "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200){
                    setProfile(res.data.profileObject);
                    setUserId(res.data.userId);
                }
            }).catch((err) => {
                //do nothing
            });;
        }
    }, [props.serverId, props.userThumbnail, props.userId]);

    //Component hook to retrieve the permissions the user has in relation to a specific server.
    useEffect(() => {
        if (props.serverId && props.userId != null) {
            axios.get(`${Constants.SERVER_URL}/servers/userPermissions/${props.serverId}/${props.userId}`, {headers: 
                {
                "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200){
                    setServerPermission(res.data.permissions);
                }
            });
        }
    }, [props.serverId, props.userId]);

    //Handles the drop down menu for the post.
    const handleSelect = (e) => {
        if (e === "view"){
            navigate(`/profile/${profile._id}`);
        } else if (e === "status") {
            props.changeRankCallback(profile._id, profile.username, serverPermission);
        }
    }

    return(
        <div className="container thumbnail-wrapper w-90">
           {profile ?
                <div className="row h-100">
                    <div className="col-md-4 my-auto">
                        <Avatar avatarPostId={profile.avatarPostId}/>
                    </div>
                    <div className="col-md-6 my-auto">
                        <div className="row">
                            {profile.username}
                        </div>
                        {serverPermission ? 
                            <div className="row">
                                {Constants.USER_STATUS[serverPermission]}
                            </div>
                        : ""}
                    </div>
                    <div className="col-md-2">
                        <DropdownButton className="m-2" title="" id="dropdown-basic-button" variant="secondary" size="sm" onSelect={handleSelect}>
                            <Dropdown.Item eventKey="view">View Profile</Dropdown.Item>
                            {(props.serverId) && (props.userPermission >= 4) && (props.userPermission >= serverPermission) && (userId !== profile._id) ?
                                <Dropdown.Item eventKey="status">Change User Rank</Dropdown.Item> 
                                : ""
                            }
                        </DropdownButton>
                    </div>
                </div>
            : <Loading/>}
        </div>

    );
}

export default UserThumbnail;