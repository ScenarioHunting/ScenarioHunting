import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestRecorder } from './test-factory/test-recorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "./test-explorer/test-explorer"
import "./styles.less"
import { isNullOrUndefined } from 'util';
// import { navigate } from "@reach/router"
function saveAs(fileName, data) {
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    if (isNullOrUndefined(window.navigator.msSaveOrOpenBlob)) {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
    else {
        window.navigator.msSaveBlob(blob, fileName);
    }
}
saveAs("fileName.cs",'data')
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