//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//ViewServer.js is a component for viewing more information about a server. A user can change the server settings here,
//view other members profiles, or leave/delete the server.

import React, {useState, useEffect, useRef} from 'react';
import {Tabs, Tab, Form, Modal, Button} from 'react-bootstrap';
import axios from 'axios';
import Avatar from '../thumbnails/Avatar';
import Loading from '../secondary/Loading'
import {useNavigate, useParams} from 'react-router-dom';
import UserThumbnail from '../thumbnails/UserThumbnail';

import * as Constants from '../../utils/constants';

function ViewServer(props) {
    
    const [updateServer, setUpdateServer] = useState(false);

    const [server, setServer] = useState(null);
    
    //Permission of the current user in relation to the server.
    const [userPermission, setUserPermission] = useState();

    const [madeChanges, setMadeChanges] = useState(true);

    const [editServerName, setEditServerName] = useState('');

    const [hoverOverAvatar, setHoverOverAvatar] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState();

    const [serverUsers, setServerUsers] = useState(null);
    const [loadedUsers, setLoadedUsers] = useState(false);

    const [loadedSecurities, setLoadedSecurities] = useState(false);

    //Radio menu variables
    const [postsVisibility, setPostsVisibility] = useState();
    const [allowJoin, setAllowJoin] = useState();
    const [allowComment, setAllowComment] = useState();
    const [usersVisibility, setUsersVisibility] = useState();

    const modalTextDict = {
        0: "Are you sure you want to leave this server?",
        1: "You are the only admin on this server, leaving will delete the server and all its posts. Is this okay?"
    }


    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveModalStage, setLeaveModalStage] = useState(0);

    const [showRankModal, setShowRankModal] = useState(false);
    const [rankModalProfile, setRankModalProfile] = useState({});
    const [rankRadio, setRankRadio] = useState(0);

    const navigate = useNavigate();
    const params = useParams();
    const formRef = useRef(null);

    //Component hook for retrieving the server information.
    useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/servers/getServer/${params.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
        }).then((res) => {
            if (res.status === 200) {
                setServer(res.data.serverObject);
                setUserPermission(res.data.permission);
                setEditServerName(res.data.serverObject.serverName);
            } else if (res.status === 404) {
                navigate('/picpark');
            } 
        });
    }, [navigate, params.serverId, updateServer]);

    //Component hook for getting the list of members of the server.
    useEffect(() => {
       axios.get(`${Constants.SERVER_URL}/servers/serverUsers/${params.serverId}`, {headers: 
            {
                "x-access-token": localStorage.getItem("authToken")
            }
        }).then((res) => {
            if (res.status === 200) {
                setServerUsers(res.data);
            }
            setLoadedUsers(true);
        }).catch((err) => {
            setLoadedUsers(true);
        })
    }, [params.serverId]);

     //Component hook for getting the server securities
     useEffect(() => {
        axios.get(`${Constants.SERVER_URL}/servers/serverSecurities/${params.serverId}`, {headers: 
             {
                 "x-access-token": localStorage.getItem("authToken")
             }
         }).then((res) => {
            if (res.status === 200) {
                setPostsVisibility(res.data.serverSecurities.postsVisibility);
                setAllowJoin(res.data.serverSecurities.allowJoin);
                setAllowComment(res.data.serverSecurities.allowComment);
                setUsersVisibility(res.data.serverSecurities.usersVisibility);
            }

             setLoadedSecurities(true);

         })
     }, [params.serverId]);

    //Save changes made to the server.
    const saveChanges = () => {
        const fd = new FormData();

        fd.append("editServerName", editServerName);

        fd.append("postsVisibility", postsVisibility);

        fd.append("allowJoin", allowJoin);

        fd.append("allowComment", allowComment);

        fd.append("usersVisibility", usersVisibility);

        if (formRef.current.files[0] && formRef.current.files[0].name) {
            fd.append('file-upload', formRef.current.files[0], formRef.current.files[0].name);
        }

        if ((!formRef.current.files[0]) || (formRef.current.files[0].type.split('/')[0] === "image")) {

            axios.post(`${Constants.SERVER_URL}/servers/updateServer/${server._id}`, fd, {
                headers: {
                    'x-access-token': localStorage.getItem("authToken"),
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setUpdateServer(!updateServer);
                    setMadeChanges(false);
                    props.refreshLeftSidebar();
                } 
            })
            .catch((err) => {
            });
        } else {
            //err
        };

       
    }

    /////////////////////Leave Server Modal//////////////////////////////

    //Opens up the leave server confirmation modal when the user clicks the Leave Server button
    const leaveServer = () => {
        setLeaveModalStage(0);
        setShowLeaveModal(true);
    }
    
    //Confirms that a user wishes to leave the server. If there are no other admins in the server, the user will get a
    //confirmation that they wish to delete the server instead.
    const leaveServerConfirm = () => {
        if (leaveModalStage === 0) {
            axios.delete(`${Constants.SERVER_URL}/servers/leaveServer/${params.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            }).then((res) => {
                if (res.status === 200) {
                    props.refreshLeftSidebar();
                    setUserPermission(0);
                    setShowLeaveModal(false);
                } else if (res.status === 202) {
                    setLeaveModalStage(1)
                    setShowLeaveModal(true);
                }
            });
        } else if (leaveModalStage === 1) {
            axios.delete(`${Constants.SERVER_URL}/servers/deleteServer/${params.serverId}`, {headers: 
                {
                    "x-access-token": localStorage.getItem("authToken")
                }
            }).then((res) => {
                props.refreshLeftSidebar();
                navigate("/picpark");
            });
        }
        
    }

    //Close the leave server modal.
    const leaveServerCancel = () => {
        setLeaveModalStage(0);
        setShowLeaveModal(false);
    }

    ////////////////////////Change rank modal///////////////////////////////////

    //Open the change user rank modal.
    const openChangeRankModal = (userId, username, serverPermission) => {
        setRankRadio(serverPermission);
        setRankModalProfile({userId: userId, username: username});
        setShowRankModal(true);
    }

    //Handles modifying the user rank radio options.
    const changeRankModalRadio = (e) => {
        switch (e.target.id) {
            case ('status-radio-0'):
                setRankRadio(0);
                break;
            case ('status-radio-1'):
                setRankRadio(1);
                break;
            case ('status-radio-2'):
                setRankRadio(2);
                break;
            case ('status-radio-3'):
                setRankRadio(3);
                break;
            case ('status-radio-4'):
                setRankRadio(4);
                break;
            case ('status-radio-5'):
                setRankRadio(5);
                break;
            default:
                //do nothing
                break;
        }
    }

    //Sends a request to the server to change the rank of a user.
    const changeRank = () => {
        const fd = new FormData();
        axios.post(`${Constants.SERVER_URL}/servers/changeRank/${server._id}/${rankModalProfile.userId}/${rankRadio}`, fd, {
                headers: {
                    'x-access-token': localStorage.getItem("authToken")
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setShowRankModal(false);
                } 
            })
            .catch((err) => {
            });
    }

     //Returns the user to the previous page.
     const exitViewServer = () => {
        navigate(-1);
    }

    //////////////////////Avatar change stuff////////////////

    //Event for when the user mouses over the avatar
    const mouseOverEvent = (e) => {
        if (userPermission >= 5) {
            setHoverOverAvatar(true);
        }
    }

    //Event for when the user is no longer mousing over the avatar
    const mouseLeaveEvent = (e) => {
        if (userPermission >= 5) {
            setHoverOverAvatar(false);
        }
    }

    //Event for when the user clicks the avatar
    const onClickAvatar = (e) => {
        if (userPermission >= 5) {
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
            
        } else {
            //display error
        }
    }

    //Triggers onchange in serverName field.
    const serverNameEvent = (e) => {
        setEditServerName(e.target.value)
        setMadeChanges(true);
    }

    //Handles radio options for server security.
    const securitySettingEvent = (e) => {
        setMadeChanges(true);
        switch (e.target.id) {
            case ('security-radio-0-0'):
                setPostsVisibility(0);
                break;
            case ('security-radio-0-1'):
                setPostsVisibility(1);
                break;
            case ('security-radio-1-0'):
                setAllowJoin(0);
                break;
            case ('security-radio-1-1'):
                setAllowJoin(1);
                break;
            case ('security-radio-2-0'):
                setAllowComment(0);
                break;
            case ('security-radio-2-1'):
                setAllowComment(1);
                break;
            case ('security-radio-3-0'):
                setUsersVisibility(0);
                break;
            case ('security-radio-3-1'):
                setUsersVisibility(1);
                break;
            default:
                //do nothing
                break;
        }
    }

    //Sends the user to the Main component of the server they're viewing the information of.
    const visitServer = () => {
        navigate(`/picpark/s/${server._id}`);
    }
    
    return (
        <div className="text-center position-relative w-100 h-100">
            <i className="bi bi-x-circle position-absolute top-0 end-0 fa-lg" onClick={exitViewServer}></i>

        <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
            <Modal.Body>{modalTextDict[leaveModalStage]}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={leaveServerCancel}>
                    Close
                </Button>
                <Button variant="primary" onClick={leaveServerConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showRankModal} onHide={() => setShowRankModal(false)}>
            <Modal.Body>
                <Form>
                    <Form.Label className="my-auto col-md-6">Set User Status for {rankModalProfile.username}</Form.Label>
                        <div className="ps-5 my-auto col-md-6 border-start border-secondary">
                            <Form.Check type='radio' id={`status-radio-0`} label={`Banned`} checked={rankRadio === 0} onChange={changeRankModalRadio}/>
                            <Form.Check type='radio' id={`status-radio-1`} label={`Non-Member`} checked={rankRadio === 1} onChange={changeRankModalRadio}/>
                            <Form.Check type='radio' id={`status-radio-2`} label={`Member`} checked={rankRadio === 2} onChange={changeRankModalRadio}/>
                            <Form.Check type='radio' id={`status-radio-3`} label={`Super Member`} checked={rankRadio === 3} onChange={changeRankModalRadio}/>
                            <Form.Check type='radio' id={`status-radio-4`} label={`Moderator`} checked={rankRadio === 4} onChange={changeRankModalRadio}/>
                            <Form.Check type='radio' id={`status-radio-5`} label={`Admin`} checked={rankRadio === 5} onChange={changeRankModalRadio}/>
                        </div>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowRankModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={changeRank}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>

            {server ?

            <div className="container start-50 translate-middle-x top-0 position-absolute w-100 mt-4 m-1 border border-secondary p-3">
                <div className="row ">
                    <div className="col-md-4 position-relative"  >
                        <div className="position-relative" onMouseOver={mouseOverEvent} onMouseLeave={mouseLeaveEvent} onClick={onClickAvatar}>
                            {hoverOverAvatar ? <img alt="Click to change the avatar." style={{borderRadius:'50%', objectFit:'cover', height:'100px', width:'100px'}} className="thumbnail-image start-50 top-50 translate-middle position-absolute" src={`${process.env.PUBLIC_URL}/images/server_default.png`}/> : ""}
                            <Avatar large={true} localPreview={previewAvatar} avatarPostId={server.avatarPostId}/>
                            <input type="file" onChange={changeAvatar} name="file-upload" id="file" ref={formRef} style={{ display: "none" }}/>
                        </div>
                    </div>
                    <div className="col-md-8 mt-5">
                        <div className="row">
                            {(userPermission >= 5) ? 
                                <input maxLength={20} type="text" value={editServerName} onInput={serverNameEvent} className="form-control w-75" rows="1" placeholder="Server Name" aria-label="Server Name"/>
                            : server.serverName}     
                        </div>
                        <div className="row">
                            Server ID: {server._id}
                        </div>
                        {(userPermission >= 5) ? <div  className="justify-content-center mt-5 mx-auto text-center w-25 row">
                            {madeChanges ? <button type="button" onClick={saveChanges} className="btn-md btn-outline-primary">Save Changes</button> : "Changes Saved"}
                        </div>
                        : ""}
                        
                    </div>
                </div>
                <div className="row m-4">
                    <Tabs defaultActiveKey="users" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="users" title="Users">
                            <div className="container">
                                {serverUsers && userPermission ?
                                    <div className="row">
                                        {
                                            serverUsers.map((el, i) => {
                                                return(
                                                    (el.permissions) > 0 ?
                                                        <div className="col-md-4" key={el._id}>
                                                            <div className="row">
                                                                <UserThumbnail userId={el.userId} changeRankCallback={openChangeRankModal} serverId={params.serverId} userPermission={userPermission}/>
                                                            </div>
                                                        </div>
                                                    : ""
                                                )
                                            })
                                        }
                                    </div>
                                : (loadedUsers ? "You do not have permission to view this server's users." : <Loading/>)}
                            </div>
                        </Tab>
                        <Tab eventKey="settings" title="Server Settings">
                            {loadedSecurities ?
                                <Form>
                                    <div className="row">
                                        <Form.Label className="my-auto col-md-6">Who can view posts?</Form.Label>
                                        <div className="ps-5 my-3 col-md-6 border-start border-secondary">
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-0-0`} label={`Anyone`} checked={postsVisibility === 0} onChange={securitySettingEvent}/>
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-0-1`} label={`Members Only`} checked={postsVisibility === 1} onChange={securitySettingEvent}/>
                                        </div>
                                        <Form.Label className="my-auto col-md-6">Who can join?</Form.Label>
                                        <div className="ps-5 my-3 col-md-6 border-start border-secondary">
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-1-0`} label={`Anyone with a link`} checked={allowJoin === 0} onChange={securitySettingEvent}/>
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-1-1`} label={`Nobody`} checked={allowJoin === 1} onChange={securitySettingEvent}/>
                                        </div>
                                        <Form.Label className="my-auto col-md-6">Who can comment on posts?</Form.Label>
                                        <div className="ps-5 my-3 col-md-6 border-start border-secondary">
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-2-0`} label={`Anyone`} checked={allowComment === 0} onChange={securitySettingEvent}/>
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-2-1`} label={`Members`} checked={allowComment === 1} onChange={securitySettingEvent}/>
                                        </div>
                                        <Form.Label className="my-auto col-md-6">Who can view members of the server?</Form.Label>
                                        <div className="ps-5 my-3 col-md-6 border-start border-secondary">
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-3-0`} label={`Anyone`} checked={usersVisibility === 0} onChange={securitySettingEvent}/>
                                            <Form.Check disabled={userPermission < 5} type='radio' id={`security-radio-3-1`} label={`Members`} checked={usersVisibility === 1} onChange={securitySettingEvent}/>
                                        </div>
                                    </div>
                                </Form>
                            : <Loading/>}
                        </Tab>
                        <Tab eventKey="banned" title="Banned Users">
                        <div className="container">
                                {serverUsers && userPermission ?
                                    <div className="row">
                                        {
                                            serverUsers.map((el, i) => {
                                                return(
                                                    (el.permissions === 0) ?
                                                        <div className="col-md-4" key={el._id}>
                                                            <div className="row">
                                                                <UserThumbnail userId={el.userId} changeRankCallback={openChangeRankModal} serverId={params.serverId} userPermission={userPermission}/>
                                                            </div>
                                                        </div>
                                                    : ""
                                                )
                                            })
                                        }
                                    </div>
                                : (loadedUsers ? "You do not have permission to view this server's users." : <Loading/>)}
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                <div className="row justify-content-end">
                    <div className="col-md-6">
                        {(userPermission >= 2) ? 
                            <div className="row">
                                <button type="button" onClick={leaveServer} className="w-100 my-2 btn-md btn-outline-primary">Leave Server</button>
                            </div>
                        : ""}
                    </div>
                    <div className="col-md-6">
                        <button type="button" onClick={visitServer} className="w-100 my-2 btn-md btn-outline-primary">Visit Server</button>
                    </div>
                </div>
                
                
                
            </div>

            : <Loading/> }
            
        </div>
    )
}

export default ViewServer;