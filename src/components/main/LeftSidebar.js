//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//LeftSidebar.js is the component that shows all of the servers the user is currently a member of on the left side of the screen.

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ServerThumbnail from '../thumbnails/ServerThumbnail';
import axios from 'axios'

import * as Constants from '../../utils/constants';

function LeftSidebar(props) {

    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);

    //Component hook that retrieves all of the servers the user is a member of.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/accounts/userServers/${props.userId}`, {headers: 
            {
            "x-access-token": localStorage.getItem("authToken")
            }
        })
        .then((res) => {
            setPermissions(res.data.permissions);
        });
    }, [props.newServer, props.userId]);

    //Sends the user to the create server screen.
    const newServer = () => {
        navigate(`/createServer`);
    }

    return(
        <div className="w-100">
            <button type="button" className="w-100 btn btn-outline-primary mt-2" onClick={newServer}><i className="bi bi-plus-circle"></i> Create new server</button>
            <ul className="list-group">
                {permissions.map((el, i) => (
                    <ServerThumbnail newServer={props.newServer} key={el._id} serverId={el.serverId}/>
                ))}
            </ul>
        </div>
    )
    
} 

export default LeftSidebar;