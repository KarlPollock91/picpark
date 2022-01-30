//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Simply displays an image that when clicked sends the user to the Post Creation component.

import { useNavigate } from 'react-router-dom';

import '../css/ImageThumbnail.css';

function NewPostThumbnail(props) {

    const navigate = useNavigate();

    //Sends the user to the post creation component.
    const newPost = () => {
        navigate(`/picpark/post/${props.serverId}`);
    }

    return(
        <div className="col-md-3" onClick={newPost}>
            <div className="grid-item border border-secondary">
                <img alt="Create new post button" className="image-thumbnail" src={`${process.env.PUBLIC_URL}/images/new_post.png`}/>
            </div>
        </div>
    )
}

export default NewPostThumbnail;