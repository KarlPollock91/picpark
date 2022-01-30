//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//PostCreation.js is where users will write a post, and upload an image along side it.

import React, {useState} from 'react';
import axios from 'axios';
import {Form} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import * as Constants from '../../utils/constants';

function PostCreation(props) {
    const [errorText, setErrorText] = useState('');
    const [textInput, setTextInput] = useState('');
    const [formRef] = useState(React.createRef());
    
    const navigate = useNavigate();
    const params = useParams();

    //Sends the forms to the server to generate a post.
    const handleCreation = () => {
        const fd = new FormData();

        fd.append("postText", textInput);
        
        if ((!formRef.current.files[0]) || (formRef.current.files[0].type.split('/')[0] === "image")) {
            fd.append('file-upload', formRef.current.files[0], formRef.current.files[0].name);
            
            axios.post(`${Constants.SERVER_URL}/posts/upload/${params.serverId}`, fd, {
                headers: {
                    'x-access-token': localStorage.getItem("authToken"),
                    'Content-Type': 'multipart/form-data'
                }
                })
            .then((res) => {
                if (res.status === 200) {
                    exitPostCreation();
                } 
            })
            .catch((err) => {
                setErrorText("Something went wrong.")
            });
        } else {
            setErrorText("Only image files can be uploaded.")
        };

    
    }

    //Returns the user to the server they were posting to.
    const exitPostCreation = () => {
        navigate(`/picpark/s/${params.serverId}`);
    }

    return (
        <div className="text-center container position-relative w-100 h-100">
            <i className="bi bi-x-circle position-absolute top-0 end-0 fa-lg" onClick={exitPostCreation}></i>
            <div className="start-50 top-50 translate-middle position-absolute w-75 mt-5">
                
                <div>{errorText}</div> 
                Post Text
                <div className="input-group w-100">
                    <textarea type="text" value={textInput} onInput={e => setTextInput(e.target.value)} className="form-control" aria-label="Add text"></textarea>
                </div>
                Image File
                <Form className="w-100" action="/file" method="post" encType="multipart/form-data">
                    <Form.Group controlId="formFile" className="mb-3" a>
                        <Form.Control type="file" name="file-upload" ref={formRef}/>
                    </Form.Group>
                </Form>
                <button type="button" onClick={handleCreation} className="btn btn-outline-primary">Submit</button>
            </div>
        </div>
  );
}

export default PostCreation;