//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Login.js contains the component that handles both login and registration for new users.

import React, {useState} from 'react';
import axios from 'axios';
import {Form} from 'react-bootstrap';

import * as Constants from '../../utils/constants';

function Login(props) {
    const [registrationMode, setRegistrationMode] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [accountNameInput, setAccountNameInput] = useState('');
    const [errorText, setErrorText] = useState('');
    const [formRef] = useState(React.createRef());
    
    //Toggles the display between login mode and registration mode.
    const toggleRegistrationMode = () => {
        if (!registrationMode) {
        setRegistrationMode(true);
        } else {
            setRegistrationMode(false);
        }
        setErrorText('');
    }

    //Sends the inputted information to the server in order to generate an account.
    const handleRegistration = () => {
        if (passwordInput === confirmPasswordInput ){

            const fd = new FormData();

            fd.append("username", usernameInput);
            fd.append("password", passwordInput);
            fd.append("accountName", accountNameInput);

            if (formRef.current.files[0] && formRef.current.files[0].name) {
                fd.append('file-upload', formRef.current.files[0], formRef.current.files[0].name);
            }

            if ((!formRef.current.files[0]) || (formRef.current.files[0].type.split('/')[0] === "image")) {
                axios.post(`${Constants.SERVER_URL}/accounts/register`, fd, {
                    headers: {
                        'Content-Type': 'application/json'}
                    })
                .then((res) => {
                    if (res.status === 200) {
                        toggleRegistrationMode();
                        setErrorText("Registration successful.")
                    } 
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setErrorText("That account name is already in use.")
                    } else {
                        setErrorText("Something went wrong.")
                    }
                });
            } else {
                setErrorText("Only image files can be set as your avatar.")
            };
        } else {
            setErrorText("Your password does not match.")
        }
    }

    //Sends the information to the server to verify for logging in.
    const handleLogin = () => {
        const data = {
            accountName: accountNameInput,
            password: passwordInput
        };

        axios.post(`${Constants.SERVER_URL}/accounts/login`, data, {
            headers: {
                'Content-Type': 'application/json'}
            })
        .then((res) => {
            if (res.status === 200) {
                localStorage.setItem("authToken", res.data.token);
                props.verifyAuth();
            } 
        })
        .catch((err) => {
            if (err.response.status === 401) {
                setErrorText("Invalid account name or password.")
            } else{
                setErrorText("Something went wrong.")
            }
        });
    }

    if (!registrationMode){
        return (
            <div className="input-form-wrapper text-center w-50 container my-5">
                <div className="row">{errorText}</div>
                <div className="input-group mb-3 row">
                    <input type="text" value={accountNameInput} onInput={e => setAccountNameInput(e.target.value)} className="form-control" placeholder="Account Name" aria-label="Account Name" aria-describedby="basic-addon1"/>
                </div>
                <div className="input-group mb-3 row">
                    <input type="text" value={passwordInput} onInput={e => setPasswordInput(e.target.value)} className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"/>
                </div>
                <button type="button row" onClick={handleLogin} className="btn btn-outline-primary">Login</button>
                <div className="user-select-none row" onClick={toggleRegistrationMode}>Register new account</div>
            </div>
        )
    } else {
        return (
            <div className="input-form-wrapper text-center w-50 container my-5">
                <div className="row">{errorText}</div>
                <div className="input-group mb-3 row">
                    <input type="text" maxLength={20} value={usernameInput} onInput={e => setUsernameInput(e.target.value)} id="reg-username" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                </div>
                <div className="input-group mb-3 row">
                    <span className="input-group-text" id="basic-addon1">@</span>
                    <input type="text" value={accountNameInput} onInput={e => setAccountNameInput(e.target.value)} className="form-control" placeholder="Account Name" aria-label="Account Name" aria-describedby="basic-addon1"/>
                </div>
                <div className="input-group mb-3 row">
                    <input type="text" value={passwordInput} onInput={e => setPasswordInput(e.target.value)} className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"/>
                </div>
                <div className="input-group mb-3 row">
                    <input type="text" value={confirmPasswordInput} onInput={e => setConfirmPasswordInput(e.target.value)} className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" aria-describedby="basic-addon1"/>
                </div>
                <Form className="row" action="/file" method="post" encType="multipart/form-data">
                        <Form.Group controlId="formFile" className="mb-3" a>
                            <Form.Control type="file" name="file-upload" ref={formRef}/>
                        </Form.Group>
                </Form>
                <button type="button" onClick={handleRegistration} className="btn btn-outline-primary row">Register</button>
                <div className="user-select-none row" onClick={toggleRegistrationMode}>Return to login</div>
            </div>
        )
    }
}

export default Login;