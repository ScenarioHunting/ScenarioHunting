import './test-step-recorder.less';
import * as React from 'react';
import { Widget, IBoard } from 'board';
import { IQueuingMachine } from "../queuing-machine/iqueuing-machine";
import { Step, convertWidgetToStepData } from './board-data-mapper';
import { TestStepTurn } from './test-step-turn';
export class TestStepDependencies {
    stepType: string
    selectionWaitingMessage: string
    turn: TestStepTurn
    board: IBoard
    stepNavigator: IQueuingMachine<TestStepTurn>
}

export class TestStepProps {
    // eslint-disable-next-line no-unused-vars
    onStepSelection: (stepResult: Step) => void
    step?: Step
}

export function createTestStepRecorder({ stepType
    , selectionWaitingMessage
    , turn
    , board
    , stepNavigator
}: TestStepDependencies) {
    return function StepRecorder(props: TestStepProps) {
        const updateWidget = (widget: Widget) => {
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
                    props.onStepSelection(step)
                }
                ,
                board.showNotification
            )
        }
        React.useEffect(() => {
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                board.showNotification(selectionWaitingMessage);
                console.log('Waiting...')
                board.onNextSingleSelection(widget => {
                    console.log(turn, 'Done...')
                    updateWidget(widget);
                    stepNavigator.nextTurn();
                });
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [stepNavigator])
        const onValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            props.step!.data.properties[index].simplePropertyValue
                = event.currentTarget.value;
        }
        // const makeExample=()=> {
        //     board.openModal('../modal.html')
        // }

        return (
            <div className="test-step" >
                <h1 className="step-type">{stepType} </h1>
                {
                    (!props.step?.data) ? <div className="waiting-for-step"> <h1 >?</h1> </div> :

                        <div style={props.step?.metadata.widget.style} className="step-content">
                            <span className="step-title">{props.step?.data.type}</span>

                            <div className="step-data">
                                {props.step?.data.properties?.map((property, index) =>
                                    <div className="step-date-property" key={`${property}~${index}`}>
                                        <label className="property-label">{property.propertyName}</label>
                                        <input readOnly={false} onChange={(e) => onValueChange(index, e)} className="property-input" type="text" value={property.simplePropertyValue}></input>
                                    </div>
                                )}
                            </div>
                            {/* <br />
                {props.data && <button
                    onClick={makeExample.bind(this)}>Make an Example</button>
                } */}
                        </div>
                }
            </div >
        );
    };
}