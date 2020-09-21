/* eslint-disable no-undef */
import * as React from 'react';
import { ViewModel, StepInfo } from '../TestFactory/test-recorder';
import "./test-explorer.less"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCheck, faRunning, faStop, faExclamation, faCut } from '@fortawesome/free-solid-svg-icons'
import { Widget } from 'board';
import { globalBoard } from '../dependency-container';
import { stat } from 'fs/promises';
import { Console } from 'console';

enum TestStatus {
    Skipped = "Skipped" as any,
    Passed = "Passed" as any,
    Failed = "Failed" as any,
    Error = "Error in running the test" as any,
    NotRun = "NotRun" as any,
    Running = "Running" as any
}

interface TestExecutionStatus {
    message?: any;
    status: string;
}

interface TestExecutionViewModel {
    testName: string;
    result: TestExecutionStatus;
}

export const TestExplorer = (props): JSX.Element => {

    const getAllTests = async (testContext: string) => {
        const response = await fetch(`https://localhost:6001/Tests/all/${testContext}`,
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

        console.log(response.body)
        if (response.ok) {
            console.log(JSON.stringify(await response.json()));
            // var xxx = (await response.json()).Tests.map(x => {
            //     return {
            //         testName: x.test.testName,
            //         testContext: "SampleService",
            //         sutName: x.test.sut,
            //         givens: x.test.given.map((step, i) => {
            //             return {
            //                 type: step.type,
            //                 widget: JSON.parse(x.Metadata).given[i]
            //             }
            //         }) as StepInfo[]
            //         when: {
            //             type: x.test.
            //         }
            //         // then: Step
            //     }
            // })
        }
        else {
            console.log(response)
        }
    }

    // getAllTests('SampleService')

    // eslint-disable-next-line react/prop-types
    if (!props.location.state?.newTest)
        return <div>No Tests</div >
    // eslint-disable-next-line react/prop-types
    const viewModel = props.location.state.newTest as ViewModel
    // eslint-disable-next-line react/prop-types
    console.log('typeof props from test-explorer.tsx', props)

    const tests = [viewModel]

    return <>
        {tests.map(vm => <TestExplorerItem key={vm.testName} viewModel={vm} />)}
    </>

}
const TestResult = (props: TestExecutionStatus): JSX.Element => {

    return <span title={props.message} className="test-running-status">
        {props.status == TestStatus.NotRun.toString() ?
            <div className="test-not-run">
                {/* <FontAwesomeIcon icon={faRunning} /> */}
            Not Run
            </div>
            : props.status == TestStatus.Running.toString() ?
                <div className="test-running">
                    {/* <FontAwesomeIcon icon={faRunning} /> */}
                    Running
                </div >
                : props.status == TestStatus.Passed.toString() ?
                    <div className="test-passed">
                        {/* <FontAwesomeIcon icon={faCheck} /> */}
                        Passed
                        {/* <span className="tooltiptext">
                            Test is running please wait!
                        </span> */}

                    </div >
                    : props.status == TestStatus.Failed.toString() ?
                        <div className="test-failed" >
                            {/* <FontAwesomeIcon icon={faStop} /> */}
                            {/* <span className="tooltiptext" >
                                {props.message}
                            </span> */}
                         Failed
                         </div >
                        : props.status == TestStatus.Skipped.toString() ?
                            <div className="test-skipped">
                                {/* <FontAwesomeIcon icon={faExclamation} /> */}
                        Skipped
                        </div>
                            :

                            <div className="test-running-error">
                                {/* <FontAwesomeIcon icon={faCut} /> */}
                        Error in running
                                {/* <span className="tooltiptext">
                                    {props.message}
                                </span> */}
                            </div>
        }
    </span>
    // switch (props.Status) {
    //     case TestStatus.Passed:
    //         return <pre>Passed</pre>
    //     case TestStatus.Failed:
    //         return <pre>Failed</pre>
    //     case TestStatus.Skipped:
    //         return <pre>Skipped</pre>
    //     default:
    //         return <pre>Error</pre>
    // }
    // return <></>
}
const TestExplorerItem = (props): JSX.Element => {
    const [status, recordStatus] = React.useState<TestExecutionStatus>({
        status: TestStatus.NotRun.toString()
    } as TestExecutionStatus);

    const runTest = async (testContext: string, testName: string) => {
        recordStatus({ status: TestStatus.Running.toString() })
        const response = await fetch(`https://localhost:6001/Tests/run/${testContext}/${testName}`,
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

        if (response.ok) {
            const json = (await response.json())[0];
            const status = (json as TestExecutionViewModel).result
            console.log(status)
            recordStatus(status)
            // (await miro.board.widgets.create({type: 'shape', x:-6152.906990387802-200, y:7674.673277112374-200}))[0]
            return;
        }
        recordStatus({
            status: TestStatus.Error.toString(),
            message: response.statusText
        } as TestExecutionStatus)

    }
    const focusWidget = (widget: Widget) =>
        globalBoard.zoomTo(widget)

    console.log(props.viewModel)
    return <div className="test-item">
        <div className="test-item-header">
            <span >{props.viewModel.testName}</span>

            <FontAwesomeIcon icon={faPlay}
                className="icon"
                onClick={async _ => await runTest(props.viewModel.testContext
                    , props.viewModel.testName)} />
            <TestResult status={status.status} message={status?.message} />
        </div>
        <br />
        <div className="test-steps-view-model-item">
            {
                props.viewModel.givens.map(given =>

                    <span onClick={_ => focusWidget(given.widget)}
                        style={given.widget.style}
                        className="test-step-view-model-item">
                        {given.type}
                    </span>

                )
            }

            <span onClick={_ => focusWidget(props.viewModel.when.widget)}
                style={props.viewModel.when.widget.style}
                className="test-step-view-model-item">
                {props.viewModel.when.type}
            </span>
            <span onClick={_ => focusWidget(props.viewModel.then.widget)}
                style={props.viewModel.then.widget.style}
                className="test-step-view-model-item">
                {props.viewModel.then.type}
            </span>
        </div>
    </div>
}