import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TestStepTurn } from './TestFactory/test-step-recorder';
import { Board } from 'board';
import { IQueuingMachine } from './TestFactory/queuing-machine';
import { TestRecorder, ViewModel } from './TestFactory/test-recorder';
import { Router, Link } from "@reach/router"
import { TestExplorer } from "./TestExplorer/test-explorer"
import "./styles.less"
import { navigate } from "@reach/router"

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