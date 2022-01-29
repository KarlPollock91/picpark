//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//CommentThumbnail.js displays the comments posted in the comment section including information about the user who posted it.

import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import axios from 'axios';

import '../css/Thumbnail.css';
import * as Constants from '../../utils/constants';

import Loading from '../secondary/Loading';
import Avatar from '../thumbnails/Avatar';


function CommentThumbnail(props) {

    const [author, setAuthor] = useState(null);
    const [userId, setUserId] = useState();

    //Component hook to retrieve the profile of the comments author.
    useEffect(() => {
        if (props.commentObject != null) {
            axios.get(`${Constants.SERVER_URL}/accounts/getUser/${props.commentObject.authorId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200){
                    setAuthor(res.data.profileObject); 
                    setUserId(res.data.userId);
                }
            }).catch((err) => {
                //do nothing
            });;
        }
    }, [props.commentObject]);

    //Handles selection from the dropdown menu.
    const handleSelect = (e) => {
        if (e === "delete"){
            props.deleteCommentCallback(props.commentObject._id);
        }
    }

    return(
        author ?
            <div className="container thumbnail-wrapper w-90 m-2 border border-secondary">
                    <div className="position-absolute end-0 me-2">
                        {(author._id === userId) ?
                            <DropdownButton title="" id="dropdown-basic-button" variant="secondary" size="sm" onSelect={handleSelect}>
                                <Dropdown.Item eventKey="delete">Delete</Dropdown.Item>
                            </DropdownButton>
                        : ""}
                    </div>
                    <div className="row h-100">
                        <div className="col-md-2 my-3">
                            <Avatar avatarPostId={author.avatarPostId}/>
                        </div>
                        <div className="col-md-10 my-auto">
                            <div className="border-bottom border-secondary text-center">
                                <h5>{author.username}</h5>
                            </div>
                            <div className="w-100 p-2">
                                {props.commentObject.commentText}
                            </div>
                        </div>
                    </div>
            </div>
        : <Loading/>

    );
}

export default CommentThumbnail;