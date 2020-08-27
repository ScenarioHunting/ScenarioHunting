import * as React from 'react';
import { ViewModel } from '../TestFactory/TestRecorder';
export const TestExplorer = (props): JSX.Element => {
    const testStepViewModelItem: React.CSSProperties = {
        width: "100px",
        height: "100px",
        display: "inline-block",
        margin: "5px",
        padding: "5px",
        overflowWrap: "break-word",
    }
    const testStepsViewModelItem: React.CSSProperties = {
        display: "flex"
    }
    if (!props.location.state?.newTest)
        return <div>No Tests</div >
    const viewModel = props.location.state.newTest as ViewModel
    console.log(viewModel)
    return <div>
        <span>{viewModel.testName}	</span>
        <br />
        <div style={testStepsViewModelItem} className="test-steps-view-model-item">
            {/* <span style={testStepViewModelItem} */}
            <span 
            // style={viewModel.givens[0].step.metadata.widget.style}
                className="test-step-view-model-item">
                {viewModel.givens[0].step.data.type}
            </span>
            <span style={viewModel.when.metadata.widget.style}
                className="test-step-view-model-item">
                {viewModel.when.data.type}
            </span>
            <span style={viewModel.then.metadata.widget.style}
                className="test-step-view-model-item">
                {viewModel.then.data.type}
            </span>
        </div>
    </div>
}