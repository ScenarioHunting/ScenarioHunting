import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestRecorder } from './test-factory/test-recorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "./test-explorer/test-explorer"
import "./styles.less"
import { navigate } from "@reach/router"

ReactDOM.render(
    // <TestRecorder />

    <>
        <nav>
            <Link to="/">New Test</Link> |{" "}
            <Link to="/test-explorer">Test Explorer</Link> |{" "}
        </nav>
        <Router>
            <TestRecorder default path="/" />
            <TestExplorer path="test-explorer" />
        </Router>
    </>
    , document.getElementById('react-app')
)
navigate('/')