//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//ServerThumbnail.js is a component that displays a server name, avatar and provides options to visit the Server Information or Main
//components for the server.

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Constants from '../../utils/constants';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import Avatar from '../thumbnails/Avatar';
import Loading from '../secondary/Loading';

import '../css/Thumbnail.css';

function ServerThumbnail(props) {

    const navigate = useNavigate();
    const [server, setServer] = useState({});

    //Component hook to retrieve the server information.
    useEffect(() => {
        if (props.serverId != null) {
            axios.get(`${Constants.SERVER_URL}/servers/getServer/${props.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200){
                    setServer(res.data.serverObject); 
                }
            }).catch((err) => {
                //do nothing
            });
        }
    }, [props.serverId, props.newServer, props.permissionObject]);


    //Handles selection of the dropdown menu.
    const handleSelect = (e) => {
        if (e === "view"){
            navigate(`/picpark/serverInfo/${server._id}`);
        } else if (e === "visit") {
            navigate(`/picpark/s/${server._id}`);
        }
    }

    return(
        <div className="container thumbnail-wrapper w-90 my-1">
           {server ?
                <div className="row h-100">
                    <div className="col-md-4 my-auto">
                        <Avatar avatarPostId={server.avatarPostId}/>
                    </div>
                    <div className="col-md-6 my-auto">
                        {server.serverName}
                    </div>
                    <div className="col-md-2">
                        <DropdownButton className="m-2" title="" id="dropdown-basic-button" variant="secondary" size="sm" onSelect={handleSelect}>
                            <Dropdown.Item eventKey="visit">Visit Server</Dropdown.Item>
                            <Dropdown.Item eventKey="view">Server Information</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            : <Loading/>}
        </div>

    );
}

export default ServerThumbnail;