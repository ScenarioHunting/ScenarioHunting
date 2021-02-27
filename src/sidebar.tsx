import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestRecorder } from './test-factory/test-recorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "./test-explorer/test-explorer"
import "./styles.less"
import * as FileSaver from 'file-saver';
// import { navigate } from "@reach/router"
var blob = new Blob([JSON.stringify("testCode")], { type: "text/plain;charset=utf-8" });
FileSaver.saveAs(blob, "testName.cs");
ReactDOM.render(
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
//  navigate('/')