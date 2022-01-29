//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//Displays a users profile which can include servers they're a part of as well as security options.

import React, {useState, useEffect, useRef} from 'react';
import {Tabs, Tab, Form} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

import Avatar from '../thumbnails/Avatar';
import Loading from '../secondary/Loading'
import ServerThumbnail from '../thumbnails/ServerThumbnail';

import * as Constants from '../../utils/constants';

function ViewProfile(props) {
    
    const [updateProfile, setUpdateProfile] = useState(false);

    const [profile, setProfile] = useState(null);
    const [userId, setUserId] = useState();

    const [madeChanges, setMadeChanges] = useState(true);

    const [editUsername, setEditUsername] = useState('');

    const [hoverOverAvatar, setHoverOverAvatar] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState();

    const [userServers, setUserServers] = useState([]);
    const [loadedServers, setLoadedServers] = useState(false);

    const [userSecurities, setUserSecurities] = useState();
    const [loadedSecurities, setLoadedSecurities] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const formRef = useRef(null);

    //Component hook for retrieving the user profile.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/accounts/getUser/${params.userId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
        }).then((res) => {
            if (res.status === 200) {
                setProfile(res.data.profileObject);
                setUserId(res.data.userId);
                setEditUsername(res.data.profileObject.username);
            } else if (res.status === 404) {
                navigate('/');
            }
        });
    }, [navigate, params.userId, updateProfile]);

    //Component hook for getting the servers the profile's user is a member of.
    useEffect(() => {
       axios.get(`${Constants.SERVER_URL}/accounts/userServers/${params.userId}`, {headers: 
            {
                "x-access-token": localStorage.getItem("authToken")
            }
        }).then((res) => {
            if (res.status === 200) {
                setUserServers(res.data.permissions);
                setLoadedServers(true);
            }
        }).catch((err) => {
            setLoadedServers(true);
        })
    }, [params.userId]);

    //Component hook for getting the security settings of the current user. only displayed if viewing on profile.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/accounts/userSecurities`, {headers: 
            {
                "x-access-token": localStorage.getItem("authToken")
            }
        }).then((res) => {
            setUserSecurities(res.data);
            setLoadedSecurities(true);
        })
    }, [])

    //Submit input forms to server to save changes made to profile.
    const saveChanges = () => {
        const fd = new FormData();

        fd.append("editUsername", editUsername);
        fd.append("userSecurities", userSecurities);
        

        if (formRef.current.files[0] && formRef.current.files[0].name) {
            fd.append('file-upload', formRef.current.files[0], formRef.current.files[0].name);
        }

        if ((!formRef.current.files[0]) || (formRef.current.files[0].type.split('/')[0] === "image")) {
            axios.post(`${Constants.SERVER_URL}/accounts/updateProfile/${profile._id}`, fd, {
                headers: {
                    'x-access-token': localStorage.getItem("authToken"),
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setUpdateProfile(!updateProfile);
                    setMadeChanges(false);
                    props.refreshRightSidebar();
                } 
            })
            .catch((err) => {
            });
        } else {
            //err
        };

       
    }

     //Returns the user to the previous page
     const exitViewProfile = () => {
        navigate(-1);
    }

    //Event for when the user mouses over their avatar.
    const mouseOverEvent = (e) => {
        if (profile._id === userId) {
            setHoverOverAvatar(true);
        }
    }

    //Event for when the user is no longer mousing over their avatar.
    const mouseLeaveEvent = (e) => {
        if (profile._id === userId) {
            setHoverOverAvatar(false);
        }
    }

    //Event for when the user clicks the avatar
    const onClickAvatar = (e) => {
        if (profile._id === userId) {
            formRef.current.click();
        }
    }


    //Sets the thumbnail avatar to be a new one, and readies the data for uploading.
    const changeAvatar = (e) => {
        if ((formRef.current.files[0].type.split('/')[0] === "image")) {
            var reader = new FileReader();
            reader.onload = function () {
                setPreviewAvatar(reader.result);
            }
            reader.readAsDataURL(formRef.current.files[0]);
            setMadeChanges(true);
            
        }
    }

    //Triggers onchange in username field.
    const usernameEvent = (e) => {
        setEditUsername(e.target.value)
        setMadeChanges(true);
    }

    //Event for handling changing the radio options in the server settings.
    const securitySettingEvent = (e) => {
        setMadeChanges(true);
        const updatedSecurities = userSecurities;
        switch (e.target.id) {
            case ('security-radio-0'):
                updatedSecurities.serversVisibility = 0;
                break;
            case ('security-radio-1'):
                updatedSecurities.serversVisibility = 1;
                break;
            case ('security-radio-2'):
                updatedSecurities.serversVisibility = 2;
                break;
            default:
                //Do nothing
                break;
        }
        setUserSecurities(updatedSecurities);
    }
    
    return (
        <div className="text-center position-relative w-100 h-100">
            <i className="bi bi-x-circle position-absolute top-0 end-0 fa-lg" onClick={exitViewProfile}></i>

            {profile ?

            <div className="container start-50 translate-middle-x top-0 position-absolute w-100 mt-4 m-1 border border-secondary p-3">
                <div className="row ">
                    <div className="col-md-4 position-relative"  >
                        <div className="position-relative" onMouseOver={mouseOverEvent} onMouseLeave={mouseLeaveEvent} onClick={onClickAvatar}>
                            {hoverOverAvatar ? <img alt="Click to change the avatar." style={{borderRadius:'50%', objectFit:'cover', height:'100px', width:'100px'}} className="thumbnail-image start-50 top-50 translate-middle position-absolute" src={`${process.env.PUBLIC_URL}/images/server_default.png`}/> : ""}
                            <Avatar large={true} localPreview={previewAvatar} avatarPostId={profile.avatarPostId}/>
                            <input type="file" onChange={changeAvatar} name="file-upload" id="file" ref={formRef} style={{ display: "none" }}/>
                        </div>
                    </div>
                    <div className="col-md-8 mt-5">
                        <div className="row">
                            {profile._id  === userId ? 
                                <input maxLength={20} type="text" value={editUsername} onInput={usernameEvent} className="form-control w-75" rows="1" placeholder="Username" aria-label="Username"/>
                            : profile.username}
                            
                        </div>
                        <div className="row">
                            Account ID: {profile._id}
                        </div>
                    </div>
                </div>
                <div className="row m-4">
                    <Tabs defaultActiveKey="servers" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="servers" title="Servers">
                            <div className="container">
                                {userServers ?
                                    <div className="row">
                                        {
                                            userServers.map((el, i) => (
                                                <div className="col-md-4" key={el._id}>
                                                    <ServerThumbnail serverId={el.serverId}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                : (loadedServers ? "You do not have permission to view these servers." : <Loading/>)}
                            </div>
                        </Tab>
                        {userId === profile._id ?
                            <Tab eventKey="settings" title="Account Settings">
                                {loadedSecurities ?
                                    <Form>
                                        <div className="row">
                                            <Form.Label className="my-auto col-md-6">Who can view the servers you're a member of?</Form.Label>
                                            <div className="ps-5 my-auto col-md-6 border-start border-secondary">
                                                <Form.Check type='radio' id={`security-radio-0`} label={`Anyone`} checked={userSecurities.serversVisibility === 0} onChange={securitySettingEvent}/>
                                                <Form.Check type='radio' id={`security-radio-1`} label={`Users I share a server with`} checked={userSecurities.serversVisibility === 1} onChange={securitySettingEvent}/>
                                                <Form.Check type='radio' id={`security-radio-2`} label={`No one`} checked={userSecurities.serversVisibility === 2} onChange={securitySettingEvent}/>
                                            </div>
                                        </div>
                                    </Form>
                                : <Loading/>}
                            </Tab>
                        : ""}
                    </Tabs>
                </div>

                <div className="row justify-content-end">
                    {profile._id === userId ? <div  className="justify-content-center mt-5 mx-auto text-center w-25 row">
                            {madeChanges ? <button type="button" onClick={saveChanges} className="btn-md btn-outline-primary">Save Changes</button> : "Profile Saved"}
                        </div>
                    : ""}
                </div>
                
                
                
            </div>

            : <Loading/> }
            
        </div>
    )
}

export default ViewProfile;