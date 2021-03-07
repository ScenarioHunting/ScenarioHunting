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
                <img alt="New Test" src="https://cdn3.iconfinder.com/data/icons/seo-and-internet-marketing-11/512/9-512.png">
                </img>
            </Link>
            <Link to="/test-explorer">
                <img alt="Existing Tests" src="https://cdn2.iconfinder.com/data/icons/miscellaneous-31/60/chemistry-tubes-512.png">
                </img>
            </Link>
            <Link to="/template-list">
                <img alt="Templates" src="https://cdn2.iconfinder.com/data/icons/solid-apps-and-programming/32/Applications_and_Programming_laptop_computer_coding_code_script-512.png">
                </img>
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