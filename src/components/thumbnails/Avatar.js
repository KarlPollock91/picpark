//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Avatar.js is a component used in thumbnails to display an image from the server in an avatar format.

import React, {useEffect, useState} from 'react';
import '../css/Thumbnail.css';
import axios from 'axios'

import * as Constants from '../../utils/constants';

function Avatar(props) {

    const [avatarDataId, setAvatarDataId] = useState();

    //Component hook to retrieve the image from the server.
    useEffect(() => {
        if (props.avatarPostId != null) {
            axios.get(`${Constants.SERVER_URL}/files/getImageFromPost/${props.avatarPostId}`, {headers: 
                {
                "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setAvatarDataId(res.data.dataId);
                }
            }).catch((err) => {
            });
        }
    }, [props.avatarPostId]);

    return(
        <img alt="User avatar" style={{borderRadius:'50%', objectFit:'cover', height: props.large ? '150px' : '50px', width: props.large ? '150px' : '50px'}} 
            className="thumbnail-image" 
            src={props.localPreview ? props.localPreview :
                (avatarDataId ? `${Constants.SERVER_URL}/files/image/${avatarDataId}` : `${process.env.PUBLIC_URL}/images/server_default.png`)}/>
    );
}

export default Avatar;