//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Main.js contains the main view for servers in which users can view posts and create new ones.

import React, {useState, useEffect} from 'react';
import {useNavigate, useParams } from "react-router-dom";
import axios from 'axios'

import '../css/Main.css'
import * as Constants from '../../utils/constants';

import ServerThumbnail from '../thumbnails/ServerThumbnail';
import PostThumbnail from '../thumbnails/PostThumbnail'
import NewPostThumbnail from '../thumbnails/NewPostThumbnail';
import Loading from '../secondary/Loading';

function Main(props) {
    const [postIds, setPostIds] = useState();
    const [loadedPosts, setLoadedPosts] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const [serverSecurities, setServerSecurities] = useState();
    const [userPermissions, setUserPermissions] = useState(0);
    const [loadedSecurities, setLoadedSecurities] = useState(false);

    //Component hook to retrieve all the posts currently on this server.
    useEffect(() => {
            axios.get(`${Constants.SERVER_URL}/servers/getPosts/${params.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                setLoadedPosts(true);
                if (res.status === 200) {
                    setPostIds(res.data);
                } else if (res.status === 404) {
                    navigate('/')
                }
            }).catch((err) => {
                setLoadedPosts(true);
            });
    }, [navigate, params.serverId]);

    //Component hook that retrieves the security settings of the current server.
    useEffect(() => {
            axios.get(`${Constants.SERVER_URL}/servers/serverSecurities/${params.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setServerSecurities(res.data.serverSecurities);
                    setUserPermissions(res.data.permissions);
                    setLoadedSecurities(true);
                }
            })
    }, [params.serverId]);

    //Adds the current user as a member of the server.
    const joinServer = () => {
        const fd = new FormData();
        axios.post(`${Constants.SERVER_URL}/servers/joinServer/${params.serverId}`, fd, {headers: 
            {
                "x-access-token": localStorage.getItem("authToken")
            }
        })
        .then((res) => {
            if (res.status === 200) {
                props.refreshLeftSidebar();
                setUserPermissions(2);
            }
        });
    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <ServerThumbnail serverId={params.serverId}/>
                </div>
                <div className="text-center align-middle col-md-6">
                    {loadedSecurities ?
                        ((userPermissions === 1) && (serverSecurities.allowJoin === 0)) ?
                            <button type="button" onClick={joinServer} className="px-5 my-2 btn-lg btn-outline-primary">Join Server</button>
                        : <div className="my-3"> Status: {Constants.USER_STATUS[userPermissions]} </div>
                    : ""}
                </div>
            </div>
             
            <div className="row gy-4 mx-auto pt-3">
                {loadedSecurities && userPermissions >= 2 ?
                    <NewPostThumbnail serverId={params.serverId}/>
                : ""}
                {postIds ?
                        postIds.map((el, i) => (
                            <PostThumbnail postObject={el} key={el._id}/>
                        ))
                : (loadedPosts ? "You do not have permission to view these posts" : <Loading/>)}
            </div> 
            
        </div>
    )
} 

export default Main;