import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestStepTurn } from './testStepRecorder';
import { Board } from 'Board';
import { IQueuingMachine } from './QueuingMachine';
import { TestRecorder, ViewModel } from './TestRecorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "../TestExplorer/TestExplorer"
import "./styles.less"
function createTestRecorder(globalBoard: Board, globalStepNavigator: IQueuingMachine<TestStepTurn>) {

}
// const style: React.CSSProperties = {
// 	// backgroundColor: "DodgerBlue",
// 	width: "100%",
// 	height: "100%"
// }

ReactDOM.render(
	<>
		<nav>
			<Link to="/">New Test</Link> |{" "}
			<Link to="/test-explorer">Test Explorer</Link> |{" "}
		</nav>
		<Router>
			<TestRecorder path="/" />
			<TestExplorer path="test-explorer" />
		</Router>

	</>
	, document.getElementById('react-app')
)