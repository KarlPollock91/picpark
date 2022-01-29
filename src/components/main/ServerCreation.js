//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//ServerCreation.js holds the component for creating a new server.

import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Form} from 'react-bootstrap';

import * as Constants from '../../utils/constants';

function ServerCreation(props) {

    const [nameInput, setNameInput] = useState('');
    const [errorText, setErrorText] = useState('');
    const [formRef] = useState(React.createRef());
    const navigate = useNavigate();

    //Sends input forms to server to generate a user server.
    const handleCreation = () => {
        const fd = new FormData();

        fd.append("serverName", nameInput);
        

        if (formRef.current.files[0] && formRef.current.files[0].name) {
            fd.append('file-upload', formRef.current.files[0], formRef.current.files[0].name);
        }

        if ((!formRef.current.files[0]) || (formRef.current.files[0].type.split('/')[0] === "image")) {
            axios.post(`${Constants.SERVER_URL}/servers/create`, fd, {
                headers: {
                    'x-access-token': localStorage.getItem("authToken"),
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setErrorText("Server created")
                    finishServerCreation(res.data.serverId);
                } 
            })
            .catch((err) => {
                setErrorText("Something went wrong.")
            });
        } else {
            setErrorText("Only image files can be set as the server thumbnail.")
        };
    }

    //Sends the user back a page.
    const cancelServerCreation = () => {
        navigate(-1);
    }

    //Sends the user to the Main.js component for server with id serverId
    const finishServerCreation = (serverId) => {
        props.refreshLeftSidebar();
        navigate(`/s/${serverId}`);
    }
        return (
            <div className="text-center position-relative w-100 h-100">
                <i className="bi bi-x-circle position-absolute top-0 end-0 fa-lg" onClick={cancelServerCreation}></i>
                <div className="mx-auto w-75 mt-5">
                    <div>{errorText}</div>
                    Server Name
                    <div className="input-group mb-3 ">
                        <input type="text" maxLength={20} value={nameInput} onInput={e => setNameInput(e.target.value)} className="form-control" placeholder="Server Name" aria-label="servername" aria-describedby="basic-addon1"/>
                    </div>
                    Server Thumbnail
                    <Form action="/file" method="post" encType="multipart/form-data">
                        <Form.Group controlId="formFile" className="mb-3" a>
                            <Form.Control type="file" name="file-upload" ref={formRef}/>
                        </Form.Group>
                    </Form>
                    <button type="button" onClick={handleCreation} className="btn btn-outline-primary">Create</button>
                </div>
            </div>
        )
}

export default ServerCreation;