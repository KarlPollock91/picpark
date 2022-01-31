//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//ViewPost.js allows a user to view the post, who made it and when, as well as comment and read comments written on the post.

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import {Dropdown, DropdownButton} from 'react-bootstrap';

import '../css/ViewPost.css'
import * as Constants from '../../utils/constants';

import UserThumbnail from '../thumbnails/UserThumbnail';
import CommentSection from '../secondary/CommentSection';
import Loading from '../secondary/Loading';

function ViewPost(props) {
    
    const [userId, setUserId] = useState('');
    const [post, setPost] = useState({});
    const [displayPostText, setDisplayPostText] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [date, setDate] = useState('');

    const navigate = useNavigate();
    const params = useParams();
  
    //Component hook to retrieve the post information from the server.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/servers/getPost/${params.serverId}/${params.postId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
        }).then((res) => {
            if (res.status === 200) {
                setDate(new Date(res.data.post.date));
                setPost(res.data.post);
                setUserId(res.data.userId);
                setDisplayPostText(res.data.post.postText);
            } else  if (res.status === 404) {
                navigate('/picpark');
            }

        })
    }, [navigate, params.postId, params.serverId]);

    //Sends inputted data to the server to edit the post.
    const editPost = () => {
        setEditMode(false);
        const fd = new FormData();
        fd.append("displayPostText", displayPostText);

        axios.post(`${Constants.SERVER_URL}/posts/editPost/${params.serverId}/${params.postId}`, fd,
            {
                headers: 
                    {
                        "x-access-token": localStorage.getItem("authToken"),
                        'Content-Type': 'multipart/form-data'
                    }
            })
            .then((res) => {
                if (res.status === 200){
                    
                } else {
                    setDisplayPostText(post.postText);
                }
            });
    }

    //Sends a request to the server to delete the post.
    const deletePost = () => {
        axios.delete(`${Constants.SERVER_URL}/posts/deletePost/${params.serverId}/${params.postId}`, {headers: 
        {
            "x-access-token": localStorage.getItem("authToken")
        }})
        .then((res) => {
            if (res.status === 200){
                exitViewPost();
            }
        });
    }

    //Handles the drop down menu for the post.
    const handleSelect = (e) => {
        if (e === "edit"){
            setEditMode(true);
        } else if (e === "delete"){
            deletePost();
        }
    }

    //Return to the Main view for the posts server.
    const exitViewPost = () => {
        navigate(`/picpark/s/${params.serverId}`);
    }

   

    return (
        <div className="container text-center position-relative w-100 h-100">
            <i className="bi bi-x-circle position-absolute top-0 end-0 fa-lg" onClick={exitViewPost}></i>
            {post ?

                <div className="row start-50 translate-middle-x top-0 position-absolute w-100 mt-4 m-1">
                    <div className="col">
                        {post.dataType !== "text" ?
                            <div className="row border border-secondary content-viewer">
                                <div className="position-absolute end-0 me-4 mt-2">
                                    {(post.authorId === userId) ?
                                        <DropdownButton title="" id="dropdown-basic-button" variant="secondary" size="sm" onSelect={handleSelect}>
                                            <Dropdown.Item eventKey="edit">Edit</Dropdown.Item>
                                            <Dropdown.Item eventKey="delete">Delete</Dropdown.Item>
                                        </DropdownButton>
                                    : ""}
                                </div>
                                <div>
                                    {post.dataType === "image" ? <img alt={`Posted by user with ID ${post.authorId}`}  className="img-fluid my-3 mx-auto d-block" src={`${Constants.SERVER_URL}/files/image/${post.dataId}`}/> : null}
                                </div>
                            </div>
                        : null} 

                        <div className="row border border-secondary">
                            <div className="col-4 my-auto border-end border-secondary">
                                {date ?
                                    date.toDateString()
                                : ""}
                            </div>
                            <div className="col-8">
                                <UserThumbnail userId={post.authorId}/>
                            </div>
                        </div>

                        <div className="row border border-secondary content-text mb-4 h-auto">
                            <div className="p-2">
                                {
                                    editMode 
                                    ?
                                    <div>
                                    <textarea type="text" value={displayPostText} onInput={e => setDisplayPostText(e.target.value)} className="form-control mt-3" rows="2" placeholder="Edit Post" aria-label="Edit Post"/>
                                    <button type="button" onClick={editPost} className="btn-md btn-outline-primary">Save Changes</button>
                                    </div>
                                    :
                                    displayPostText
                                }
                            </div>
                        </div>
                    </div>
                    {userId ?
                        <CommentSection userId={userId} serverId={params.serverId} postId={params.postId}/>
                    : <Loading/>} 
                </div>

            : <Loading/>}
            
        </div>
  );
}

export default ViewPost;