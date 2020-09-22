import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { Widget } from 'board';
import { globalBoard } from '../dependency-container';
import * as React from 'react';

// eslint-disable-next-line no-undef
export const TestExplorerItem = (props): JSX.Element => {
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

// eslint-disable-next-line no-undef
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