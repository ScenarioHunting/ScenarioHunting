import * as React from 'react';
import { ViewModel } from '../TestFactory/test-recorder';
import "./test-explorer.less"

export const TestExplorer = (props): JSX.Element => {

    if (!props.location.state?.newTest)
    // return <div>No Tests</div >

    {
        var t: React.CSSProperties = {
            backgroundColor: "blue"
        }
        return <div>
            <span>test Name	</span>
            <br />
            <div className="test-steps-view-model-item">
                {/* <span style={testStepViewModelItem} */}
                <span className="test-step-view-model-item">
                    GivenGivenGivenGivenGivenGivenGiven
            </span>

                <span className="test-step-view-model-item">
                    WhenWhenWhenWhenWhenWhenWhenWhenWhenWhen
            </span>
                <span className="test-step-view-model-item">
                    ThenThenThenThenThenThenThenThenThen
            </span>
            </div>
        </div>
    }










    //**************************************************************************** */
    const viewModel = props.location.state.newTest as ViewModel
    console.log(viewModel)
    return <div>
        <span>{viewModel.testName}	</span>
        <br />
        <div className="test-steps-view-model-item">
            <span style={viewModel.givens[0].step.metadata.widget.style}
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