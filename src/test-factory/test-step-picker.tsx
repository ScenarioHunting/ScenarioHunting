// import './test-step-picker.css';
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

        const [isActive, setIsActive] = React.useState<boolean>(false)
        function select() {
            console.log('Waiting...')
            board.unselectAll()
            board.showNotification(selectionWaitingMessage);
            board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
                console.log(turn, 'Selected...')
                props.onStepSelection(selectedWidget)
                stepNavigator.done(turn)
            });
        }
        React.useEffect(() => {
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                setIsActive(true)
                console.log('Waiting...')
                select()
            });
        }, [])
     
        
        const onValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            props.step!.widgetData.properties[index].simplePropertyValue
                = event.currentTarget.value;
        }

        return (
            <div className="test-step">
                {/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }}>{stepType} </h3> */}
                <button onClick={select}
                    className="image-button miro-btn miro-btn--secondary miro-btn--small"
                    style={{ display: "flex", padding: '0px', width: '94px' }}
                    disabled={!isActive}>
                    <svg style={{ flex: '0 0 20px' }} width="20px" viewBox="0 0 24 24">
                        <path d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
                    </svg>
                    <h3 style={{ margin: '0px', flex: '0 0 auto', marginTop: '10px' }}>
                        {stepType}
                    </h3>
                </button>
                {
                    (!props.step?.widgetData) ? <div className="waiting-for-step" style={{ display: isActive ? 'block' : 'none' }}> <h1 >?</h1> </div> :

                        <div style={props.step?.widgetSnapshot.style}>
                            <span className="step-title">{props.step?.widgetData.type}</span>

                            <div className="step-data">
                                {props.step?.widgetData.properties?.map((property, index) =>
                                    <div className="step-data-property" key={`${property}~${index}`}>
                                        <label className="property-label">{property.propertyName}</label>
                                        <input readOnly={false} onChange={(e) => onValueChange(index, e)}
                                            className="miro-input miro-input--small miro-input--primary property-input"
                                            type="text" value={property.simplePropertyValue}
                                            disabled={true}></input>
                                    </div>
                                )}
                            </div>
                        </div>
                }
            </div >
        );
    };
}
