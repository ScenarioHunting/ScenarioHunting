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
        <nav>
            <Link to="/">New Test</Link> |{" "}
            <Link to="/test-explorer">Test Explorer</Link> |{" "}
            <Link to="/template-list">Template List</Link>|{" "}
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