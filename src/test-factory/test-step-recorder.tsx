import './test-step-recorder.less';
import * as React from 'react';
import { IBoard, SelectedWidget } from 'board';
import { IQueuingMachine } from "../queuing-machine/iqueuing-machine";
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
    onStepSelection: (stepResult: SelectedWidget) => void
    step?: SelectedWidget
}

export function createTestStepRecorder({ stepType
    , selectionWaitingMessage
    , turn
    , board
    , stepNavigator
}: TestStepDependencies) {
    return function StepRecorder(props: TestStepProps) {
        const notifyParent = (selectedWidget: SelectedWidget) =>
            props.onStepSelection(selectedWidget)
            // props.onStepSelection({
            //     metadata: {
            //         widget: selectedWidget.widgetSnapshot
            //         , stepType: stepType
            //     }
            //     , data: selectedWidget.widgetData
            // })

        // React.useEffect(() => {
        //     board.unselectAll();
        //     stepNavigator.onTurn(turn, () => {
        //         board.showNotification(selectionWaitingMessage);
        //         console.log('Waiting...')
        //         board.onNextSingleSelection(selectedWidget => {
        //             console.log(turn, 'Done...')
        //             notifyParent(selectedWidget);
        //             stepNavigator.nextTurn();
        //         });
        //     });
        // }, [board, stepNavigator])
        const onValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            props.step!.widgetData.properties[index].simplePropertyValue
                = event.currentTarget.value;
        }
        // const makeExample=()=> {
        //     board.openModal('../modal.html')
        // }

        return (
            <div className="test-step" >
                <h1 className="step-type">{stepType} </h1>
                {
                    (!props.step?.widgetData) ? <div className="waiting-for-step"> <h1 >?</h1> </div> :

                        <div style={props.step?.widgetSnapshot.style} className="step-content">
                            <span className="step-title">{props.step?.widgetData.type}</span>

                            <div className="step-data">
                                {props.step?.widgetData.properties?.map((property, index) =>
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
