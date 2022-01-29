//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//CommentSecton.js is a secondary component that is a child of ViewPost. Here, users can read comments and comment on a post.

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as Constants from '../../utils/constants';
import CommentThumbnail from '../thumbnails/CommentThumbnail'
import '../css/Thumbnail.css';

function CommentSection(props) {

    const [comments, setComments] = useState([]);
    const [updateComments, setUpdateComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //Component hook to get the comments on a post.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/posts/getComments/${props.serverId}/${props.postId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200){
                    setComments(res.data);  
                }
            });
    }, [updateComments, props.serverId, props.postId]);

    //Delete a comment by ID.
    const deleteComment = (commentId) => {
        axios.delete(`${Constants.SERVER_URL}/posts/deleteComment/${props.serverId}/${commentId}`, {headers: 
        {
            "x-access-token": localStorage.getItem("authToken")
        }})
        .then((res) => {
            if (res.status === 200){
                setUpdateComments(!updateComments);
            }
        });
    }

    //Sends post to server to add comment to comments.
    const makeComment = (e) => {
        const fd = new FormData();
        fd.append("commentText", newComment);

        axios.post(`${Constants.SERVER_URL}/posts/makeComment/${props.serverId}/${props.postId}`, fd,
            {
                headers: 
                    {
                        "x-access-token": localStorage.getItem("authToken"),
                        'Content-Type': 'multipart/form-data'
                    }
            })
        .then((res) => {
            if (res.status === 200){
                setNewComment('');
                setUpdateComments(!updateComments);
            }
        }).catch((err) => {
            setErrorMessage("You do not have permission to comment in this server.");
        });
    }

     //Enter pressed in the comment text field.
     const submitComment = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          makeComment(e);

        }
    }

    return(
        <div className="col border border-secondary content-comment mb-4 ">
            <ul className="list-group w-100">
                    {errorMessage}
                    <div className="border-bottom border-secondary pb-2">
                    <textarea type="text" value={newComment} onInput={e => setNewComment(e.target.value)} className="form-control mt-3" rows="2" placeholder="Comment" aria-label="Comment" onKeyDown={submitComment}/>
                    <button type="button" className="btn btn-outline-secondary" onClick={makeComment}>Post Comment</button>
                    </div>
                    {comments.map((el, i) => (
                        <CommentThumbnail   key={el._id}
                                            deleteCommentCallback={deleteComment}
                                            commentObject={el}/>
                    ))}
            </ul>
        </div>

    );
}

export default CommentSection;