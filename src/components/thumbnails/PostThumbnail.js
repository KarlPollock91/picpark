//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Post thumbnail displays the image of a post in a smaller format. Clicking the thumbnail will take the user
//to the View Post component of that post.

import { useNavigate } from 'react-router-dom';
import * as Constants from '../../utils/constants';
import '../css/ImageThumbnail.css';

function PostThumbnail(props) {

    const navigate = useNavigate();

    //Sends the user to the View Post component for this post.
    const viewPost = () => {
        navigate(`/v/${props.postObject.serverId}/${props.postObject._id}`);
    }

    return(
        <div className="col-md-3">
            <div className="grid-item border border-secondary" onClick={viewPost}>
                <img alt="Preview of a user post" className="image-thumbnail" src={`${Constants.SERVER_URL}/files/image/${props.postObject.dataId}`}/>
            </div>
        </div>
    )
}

export default PostThumbnail;