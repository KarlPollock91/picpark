//Written by Karl Pollock, 2022.
//KarlPollock91@gmail.com
//www.karlpollock.com

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/main/App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {HashRouter} from 'react-router-dom';

ReactDOM.render(<HashRouter basename='/'><App /></HashRouter>, document.querySelector('#root'));
