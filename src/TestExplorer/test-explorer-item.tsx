import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { Widget } from 'board';
import { singletonBoard } from '../global-dependency-container';
import * as React from 'react';
import { ViewModel } from 'TestFactory/test-recorder';
import { TestExecutionStatus, TestExecutionViewModel } from './test-execution-viewmodel';
import { TestStatus } from './test-status';
import { TestResult } from './test-result';

// eslint-disable-next-line no-undef
const createTestExplorerItem = (board = singletonBoard) => (props): JSX.Element => {
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
        board.zoomTo(widget)

    // eslint-disable-next-line react/prop-types
    const viewModel = props.viewModel as ViewModel
    console.log(viewModel)
    return <div className="test-item">
        <div className="test-item-header">
            <span >{viewModel.testName}</span>

            <FontAwesomeIcon icon={faPlay}
                className="icon"
                onClick={async () => await runTest(viewModel.testContext
                    , viewModel.testName)} />
            <TestResult status={status.status} message={status?.message} />
        </div>
        <br />
        <div className="test-steps-view-model-item">
            {
                viewModel.givens.map((given, index) =>

                    <span key={index} onClick={() => focusWidget(given.widget)}
                        style={given.widget.style}
                        className="test-step-view-model-item">
                        {given.type}
                    </span>

                )
            }

            <span onClick={() => focusWidget(viewModel.when.widget)}
                style={viewModel.when.widget.style}
                className="test-step-view-model-item">
                {viewModel.when.type}
            </span>
            <span onClick={() => focusWidget(viewModel.then.widget)}
                style={viewModel.then.widget.style}
                className="test-step-view-model-item">
                {viewModel.then.type}
            </span>
        </div>
    </div>
}

export let TestExplorerItem = createTestExplorerItem()