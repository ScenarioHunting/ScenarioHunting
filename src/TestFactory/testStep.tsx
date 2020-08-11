import * as React from 'react';
import { Board, Widget } from 'Board';
import { IQueuingMachine } from './QueuingMachine';
export enum TestStepTurn {
    Then = 'Then',
    When = 'When',
    Given = 'Given',
}

export class TestStepOptions {
    stepTitle: string
    selectionWaitingMessage: string
    turn: TestStepTurn
    board: Board
    stepNavigator: IQueuingMachine<TestStepTurn>
}
export type StepResult = {
    widget: Widget
}
export class TestStepProps {
    // canEdit: (any) => boolean
    onChange: (stepResult: StepResult) => void
    data?: StepResult
}

export function testStep({ stepTitle, selectionWaitingMessage, turn, board, stepNavigator }: TestStepOptions) {
    return class TestStepContainer extends React.Component<TestStepProps, StepResult> {
        constructor(props: TestStepProps) {
            super(props);
        }
        updateWidget(widget: Widget) {
            // this.setState({ widget: widget } as StepResult);
            // console.log('state set:', this.state)
            this.props.onChange({ widget: widget } as StepResult);
        }
        async componentDidMount() {
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                board.showNotification(selectionWaitingMessage);
                console.log('Waiting...')
                board.onNextSingleSelection(widget => {
                    console.log('Done...')
                    this.updateWidget(widget);
                    stepNavigator.nextTurn();
                });
            });
        }
        render() {
            return (<div>
                <h1>{stepTitle} </h1>
                {/* <h3>{this.state?.widget?.text ?? '?'}</h3> */}
                <span>{this.props.data?.widget?.text}</span>
            </div>);
        }
    };
}
