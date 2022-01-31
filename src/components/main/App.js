//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//App.js is the top level component which ensures the user is logged in correctly before displaying child components.

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Route, Routes} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import * as Constants from '../../utils/constants';

import LeftSidebar from './LeftSidebar';
import Main from './Main';
import RightSidebar from './RightSidebar';
import Loading from '../secondary/Loading';
import Login from './Login';
import ServerCreation from './ServerCreation';
import PostCreation from './PostCreation';
import ViewPost from './ViewPost';
import ViewProfile from './ViewProfile';
import ViewServer from './ViewServer';
import SplashPage from './SplashPage';


function App(props) {
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState();

    const navigate = useNavigate();

    //Component hook that checks if user is logged.
    useEffect(() => {
        document.title = "picpark"
        if (!localStorage.getItem("authToken")){
            setLoading(false);
            navigate('/login');
        } else {
            verifyAuth();
        }
    }, [])

    //Send the users current auth token to the server to validate.
    const verifyAuth = () => {
        axios.get(`${Constants.SERVER_URL}/accounts/verifyAuth`, {
            headers: {
                "x-access-token": localStorage.getItem("authToken")
                // "Access-Control-Allow-Origin": "*"
            }
            }).then((res) => {
                if (res.status === 200) {
                    setUserInfo(res.data)
                } else {
                    navigate('/login');
                }
            }).catch((err) => {
                localStorage.clear();
                navigate('/login');
            });
    }

    //Log out and return to login screen.
    const logout = () => {
        localStorage.clear();
        setUserInfo(null);
        navigate('/login');
    }


    const [newServer, setNewServer] = useState(false);
    const [newUser, setNewUser] = useState(false);

    //Refresh the items in the left sidebar.
    const refreshLeftSidebar = () => {
        setNewServer(!newServer);
    }
    //Refresh the items in the right sidebar.
    const refreshRightSidebar = () => {
        setNewUser(!newUser);
    }

    if (loading) {
        return(
            <div className="wrapper w-100 h-100 mw-100 mh-100">
                <Loading/>
            </div>
        )
    } else {
        return(
            <div className="w-100 vh-100 container-fluid">
                <div className="row">
                    <div  className="col vh-100 border border-secondary full-height">
                        {userInfo ?
                            <LeftSidebar newServer={newServer} userId={userInfo._id}/>
                        : ""}
                    </div>
                    <div className="overflow-auto col-8 vh-100 border border-secondary full-height">
                    
                        <Routes>
                            <Route path="" element={<SplashPage/>}/>
                            <Route path="/login" element={<Login verifyAuth={verifyAuth}/>}/>
                            <Route path="/s/:serverId" element={<Main refreshLeftSidebar={refreshLeftSidebar}/>} />
                            <Route path="/createServer" element={ <ServerCreation refreshLeftSidebar={refreshLeftSidebar}/>}/>
                            <Route path="/post/:serverId" element={<PostCreation/>}/>
                            <Route path="/v/:serverId/:postId" element={<ViewPost />}/>
                            <Route path="/profile/:userId" element={<ViewProfile refreshRightSidebar={refreshRightSidebar}/>}/>
                            <Route path="/serverInfo/:serverId" element={<ViewServer refreshLeftSidebar={refreshLeftSidebar}/>}/>
                        </Routes>

                    </div>
                    <div  className="col vh-100 border border-secondary">
                        {userInfo ?
                            <RightSidebar newUser={newUser} userInfo={userInfo} logoutCallback={logout}/>
                        : ""}
                    </div>
                </div>
            </div>
        )

    }
    
} 

export default App;