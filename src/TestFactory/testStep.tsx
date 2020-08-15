import * as React from 'react';
import { Board, Widget } from 'Board';
import { IQueuingMachine } from './QueuingMachine';
import { stringify } from 'querystring';
import { title } from 'process';
import { fail } from 'assert';
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
    widget: Widget
}
export type StepResult = {
    metadata: StepMetadata
    title: string
    example: any
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
            this.toStepData(widget,
                data =>
                    this.props.onChange({ title: data.title, example: data.example, metadata: { widget: widget, stepType: stepType } } as StepResult)
                ,
                err => {
                    board.showNotification(err)
                })
        }
        toStepData(widget: Widget, succeed: ({ title: string, example: any }) => void, fail: (string) => void) {
            const chunks = widget.text.split('\n')
            const title = chunks.shift();
            if (!title) {
                fail("Unknown text format.")
            }
            const value = chunks
                .map(p => p.split(":"))
                .map(p => [p[0], p[1]]);
            const example = Object.fromEntries(value)
            succeed({ title, example })
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
                <span>{this.props.data?.title}</span>
                <span>{JSON.stringify(this.props.data?.example)}</span>
                {/* <br />
                {this.props.data && <button
                    onClick={this.makeExample.bind(this)}>Make an Example</button>
                } */}
            </div>);
        }
    };
}
