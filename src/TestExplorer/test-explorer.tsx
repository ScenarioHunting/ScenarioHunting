import * as React from 'react';
import { ViewModel } from '../TestFactory/test-recorder';
import "./test-explorer.less"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { Widget } from 'board';
import { globalBoard } from '../global';

enum TestStatus {
    Skipped,
    Passed,
    Failed,
    Running
}

interface TestExecutionStatus {
    Message?: any;
    Status: TestStatus;
}

interface TestExecutionViewModel {
    TestName: string;
    Result: TestExecutionStatus;
}

export const TestExplorer = (props): JSX.Element => {

    const getAllTests = async (testContext: string) => {
        const response = await fetch(`https://localhost:6001/Tests/all/${testContext}`,
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

        if (response.ok) {
            console.log(await response.json())
            
        }
    }


    if (!props.location.state?.newTest)
        return <div>No Tests</div >
    const viewModel = props.location.state.newTest as ViewModel

    const tests = [viewModel]

    return <>
        {tests.map(vm => <TestExplorerItem viewModel={vm} />)}
    </>

}
const TestExplorerItem = (props): JSX.Element => {
    let status: TestExecutionStatus
    const runTest = async (testContext: string, testName: string) => {
        const response = await fetch(`https://localhost:6001/Tests/run/${testContext}/${testName}`,
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

        if (response.ok) {
            console.log(await response.json())
            status = (await response.json() as TestExecutionViewModel).Result
        }
    }
    const focusWidget = (widget: Widget) =>
        globalBoard.zoomTo(widget)

    console.log(props.viewModel)
    return <div className="test-item">
        <div className="test-item-header">
            <span >{props.viewModel.testName}</span>
            <FontAwesomeIcon icon={faPlay}
                className="icon"
                onClick={async _ => runTest(props.viewModel.testContext
                    , props.viewModel.testName)} />
        </div>
        <br />
        <div className="test-steps-view-model-item">
            {
                props.viewModel.givens.map(given =>

                    <span onClick={_ => focusWidget(given.step.metadata.widget)}
                        style={given.step.metadata.widget.style}
                        className="test-step-view-model-item">
                        {given.step.data.type}
                    </span>

                )
            }

            <span onClick={_ => focusWidget(props.viewModel.when.metadata.widget)}
                style={props.viewModel.when.metadata.widget.style}
                className="test-step-view-model-item">
                {props.viewModel.when.data.type}
            </span>
            <span onClick={_ => focusWidget(props.viewModel.then.metadata.widget)}
                style={props.viewModel.then.metadata.widget.style}
                className="test-step-view-model-item">
                {props.viewModel.then.data.type}
            </span>
        </div>
    </div>
}