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

        // props.onStepSelection({
        //     metadata: {
        //         widget: selectedWidget.widgetSnapshot
        //         , stepType: stepType
        //     }
        //     , data: selectedWidget.widgetData
        // })
        const [isActive, setIsActive] = React.useState<boolean>(false)

        React.useEffect(() => {
            const notifyParent = (selectedWidget: SelectedWidget) =>
                props.onStepSelection(selectedWidget)
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                setIsActive(true)
                board.showNotification(selectionWaitingMessage);
                console.log('Waiting...')
                board.onNextSingleSelection(selectedWidget => {
                    console.log(turn, 'Done...')
                    notifyParent(selectedWidget);
                    stepNavigator.nextTurn();
                });
            });
        }, [])
        // }, [notifyParent])
        // }, [board, stepNavigator])
        // }, [props])
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
                    <div style={{ display: isActive ? 'initial' : 'none' }}>
                        (!props.step?.widgetData)
                        ?
                        <div className="waiting-for-step" style={props.step?.widgetSnapshot.style}> <h1 >?</h1> </div>
                        :
                        <div className="step-content">
                            <span className="step-title">{props.step?.widgetData.type}</span>

                            <div className="step-data">
                                {props.step?.widgetData.properties?.map((property, index) =>
                                    <div className="step-date-property" key={`${property}~${index}`}>
                                        <label className="property-label">{property.propertyName}</label>
                                        <input readOnly={false} onChange={(e) => onValueChange(index, e)}
                                            className="miro-input miro-input--small miro-input--primary property-input"
                                            type="text" value={property.simplePropertyValue}
                                            disabled={true}></input>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div >
        );
    };
}
