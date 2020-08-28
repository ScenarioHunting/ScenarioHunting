import './test-step-recorder.less';
import * as React from 'react';
import { Board, Widget } from 'board';
import { IQueuingMachine } from './queuing-machine';
import { Step, convertWidgetToStepData } from './step';
export enum TestStepTurn {
    Then = 'Then',
    When = 'When',
    Given = 'Given',
}

export class TestStepOptions {
    stepDisplayTitle: string
    selectionWaitingMessage: string
    turn: TestStepTurn
    board: Board
    stepNavigator: IQueuingMachine<TestStepTurn>
}

export class TestStepProps {
    // canEdit: (any) => boolean
    onStepSelection: (stepResult: Step) => void
    step?: Step
}

export function testStepRecorder({ stepDisplayTitle: stepType, selectionWaitingMessage, turn, board, stepNavigator }: TestStepOptions) {
    return class TestStepRecorder extends React.Component<TestStepProps, Step> {
        constructor(props: TestStepProps) {
            super(props);
        }
        updateWidget(widget: Widget) {
            convertWidgetToStepData(widget,
                data => {
                    const step: Step = {
                        metadata: {
                            widget: widget
                            , stepType: stepType
                        }
                        , data: {
                            type: data.type
                            , properties: data.properties
                        }
                    }
                    this.props.onStepSelection(step)
                }
                ,
                board.showNotification
            )
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
        onValueChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
            this.props.step!.data.properties[index].simplePropertyValue
                = event.currentTarget.value;
        }
        makeExample() {
            board.openModal('../modal.html')
        }
        render() {
            return (
                <div className="test-step">
                    <h1 className="step-type">{stepType} </h1>
                    {
                        (!this.props.step?.data) ? <div className="waiting-for-step"> <h1 >?</h1> </div> :

                            <div style={this.props.step?.metadata.widget.style} className="step-content">
                                <span className="step-title">{this.props.step?.data.type}</span>

                                <div className="step-data">
                                    {this.props.step?.data.properties?.map((property, index) =>
                                        <div className="step-date-property" key={`${property}~${index}`}>
                                            <label className="property-label">{property.propertyName}</label>
                                            <input readOnly={false} onChange={(e) => this.onValueChange(index, e)} className="property-input" type="text" value={property.simplePropertyValue}></input>
                                        </div>
                                    )}
                                </div>
                                {/* <br />
                {this.props.data && <button
                    onClick={this.makeExample.bind(this)}>Make an Example</button>
                } */}
                            </div>
                    }
                </div >
            );
        }
    };
}
