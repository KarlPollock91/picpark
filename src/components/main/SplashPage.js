//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//A splash page to shill my garbage.

import React from 'react';
import {NavLink} from 'react-router-dom';

function SplashPage(props) {
        return (
            <div className="w-75 mx-auto mt-5 input-form-wrapper text-center">

                <img alt="Logo for pic park" className="img-fluid" src={`${process.env.PUBLIC_URL}/images/logo.png`}/>

                <p>Hello and thank you for visiting my project, Pic Park. Feel free to create a new server in the top left and upload some images or you can visit an example server at the URL below.</p>
                <NavLink to="/picpark/s/61f4dcd42e57a1a4b41388e1">Guest Server</NavLink>
                <p>KarlPollock91@gmail.com</p>
                <p>www.karlpollock.com</p>
                <p>Created by Karl Pollock, 2022.</p>
            </div>
        )
}

export default SplashPage;