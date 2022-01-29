//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

//A simple loading screen with a loading bar.
//Loading bar is an open source design from:
//Copyright (c) 2022 by Daria Koutevska (https://codepen.io/DariaIvK/pen/EpjPRM)

import React from 'react';
import '../css/Loading.css'

class Loading extends React.Component {
    render() {
        return(
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
    }
} 

export default Loading;