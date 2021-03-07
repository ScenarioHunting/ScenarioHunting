import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestRecorder } from './test-factory/test-recorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "./test-explorer/test-explorer"
import "./styles.less"
import { navigate } from "@reach/router"
import { TemplateList } from './test-templates/template-list';

ReactDOM.render(
    <>
        <nav className="sidebar-nav">
            <Link to="/">
                <svg viewBox="0 0 16 16">
                    <polygon points="10,1 11,1 11,0 10,0 6,0 5,0 5,1 6,1 6,7 0,14 1,16 15,16 16,14 10,7 " />
                </svg>
            </Link>
            {/* <Link to="/test-explorer">
                <img alt="Existing Tests" src="https://cdn2.iconfinder.com/data/icons/miscellaneous-31/60/chemistry-tubes-512.png">
                </img>
            </Link> */}
            <Link to="/template-list">
                <svg viewBox="0 0 32 32" >
                    <path d="M27,4H5C3.3,4,2,5.3,2,7v18c0,1.7,1.3,3,3,3h22c1.7,0,3-1.3,3-3V7C30,5.3,28.7,4,27,4z M9.1,7.6c0.1-0.1,0.1-0.2,0.2-0.3  c0.1-0.1,0.2-0.2,0.3-0.2C10,6.9,10.4,7,10.7,7.3c0.1,0.1,0.2,0.2,0.2,0.3C11,7.7,11,7.9,11,8c0,0.3-0.1,0.5-0.3,0.7  C10.5,8.9,10.3,9,10,9C9.7,9,9.5,8.9,9.3,8.7C9.1,8.5,9,8.3,9,8C9,7.9,9,7.7,9.1,7.6z M6,8c0-0.3,0.1-0.5,0.3-0.7  c0,0,0.1-0.1,0.1-0.1c0.1,0,0.1-0.1,0.2-0.1C6.7,7,6.7,7,6.8,7c0.1,0,0.3,0,0.4,0c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1  c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.3C8,7.7,8,7.9,8,8c0,0.1,0,0.3-0.1,0.4C7.9,8.5,7.8,8.6,7.7,8.7C7.5,8.9,7.3,9,7,9  S6.5,8.9,6.3,8.7C6.1,8.5,6,8.3,6,8z M11.7,21.3c0.4,0.4,0.4,1,0,1.4C11.5,22.9,11.3,23,11,23s-0.5-0.1-0.7-0.3l-3-3  c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L9.4,19L11.7,21.3z M12.6,8.9c-0.1-0.1-0.2-0.1-0.3-0.2  c-0.1-0.1-0.2-0.2-0.2-0.3C12,8.3,12,8.1,12,8c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0  c0.1,0.1,0.2,0.2,0.2,0.3C14,7.7,14,7.9,14,8c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C13.5,8.9,13.3,9,13,9  C12.9,9,12.7,9,12.6,8.9z M18.9,15.4l-4,8C14.7,23.8,14.4,24,14,24c-0.2,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.4-1.3l4-8  c0.2-0.5,0.8-0.7,1.3-0.4C18.9,14.4,19.1,15,18.9,15.4z M24.7,19.7l-3,3C21.5,22.9,21.3,23,21,23s-0.5-0.1-0.7-0.3  c-0.4-0.4-0.4-1,0-1.4l2.3-2.3l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,3C25.1,18.7,25.1,19.3,24.7,19.7z" />
                </svg>
            </Link>
        </nav>
        <Router>
            <TestRecorder default path="/" />
            <TestExplorer path="test-explorer" />
            <TemplateList path="template-list" />
        </Router>
    </>
    , document.getElementById('react-app')
)
navigate('/')