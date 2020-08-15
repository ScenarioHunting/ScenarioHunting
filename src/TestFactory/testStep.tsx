import * as React from 'react';
import { Board, Widget } from 'Board';
import { IQueuingMachine } from './QueuingMachine';
export enum TestStepTurn {
    Then = 'Then',
    When = 'When',
    Given = 'Given',
}

export class TestStepOptions {
    stepType: string
    selectionWaitingMessage: string
    turn: TestStepTurn
    board: Board
    stepNavigator: IQueuingMachine<TestStepTurn>
}
export type StepMetadata = {
    stepType: string
}
export type StepResult = {
    metadata: StepMetadata
    widget: Widget
}
export class TestStepProps {
    // canEdit: (any) => boolean
    onChange: (stepResult: StepResult) => void
    data?: StepResult
}

export function testStep({ stepType, selectionWaitingMessage, turn, board, stepNavigator }: TestStepOptions) {
    return class TestStepContainer extends React.Component<TestStepProps, StepResult> {
        constructor(props: TestStepProps) {
            super(props);
        }
        updateWidget(widget: Widget) {
            // this.setState({ widget: widget } as StepResult);
            // console.log('state set:', this.state)
            this.props.onChange({ widget: widget, metadata: { stepType: stepType } } as StepResult);
        }
        async componentDidMount() {
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                board.showNotification(selectionWaitingMessage);
                console.log('Waiting...')
                board.onNextSingleSelection(widget => {
                    console.log(turn, 'Done...')
                    this.updateWidget(widget);
                    stepNavigator.nextTurn();
                });
            });
        }
        makeExample() {
            board.openModal('../modal.html')
        }
        render() {
            return (<div>
                <h1>{stepType} </h1>
                <span>{this.props.data?.widget?.text}</span>
                <br />
                {this.props.data && <button
                    onClick={this.makeExample.bind(this)}>Make an Example</button>
                }
            </div>);
        }
    };
}
