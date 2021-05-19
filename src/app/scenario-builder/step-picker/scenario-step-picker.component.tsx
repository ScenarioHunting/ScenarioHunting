import sharedStyles from './scenario-step-shared.styles.css'
import styles from './scenario-step-picker.style.css';
import * as React from 'react';
import { IBoard, SelectedStep } from '../../ports/iboard';
import { IQueuingMachine } from "../../../libs/queuing-machine/iqueuing-machine";
import { TestStepTurn } from './scenario-step-turn';
import { log } from "../../../external-services";
import { arrayProperty, singularProperty, prop } from '../../../app/spec';

export class TestStepDependencies {
    stepType: string
    selectionWaitingMessage: string
    turn: TestStepTurn
    board: IBoard
    stepNavigator: IQueuingMachine<TestStepTurn>
}

export class TestStepProps {
    // eslint-disable-next-line no-unused-vars
    onStepSelection: (stepResult: SelectedStep) => void
    step?: SelectedStep
}

export function createTestStepRecorder({ stepType
    , selectionWaitingMessage
    , turn
    , board
    , stepNavigator
}: TestStepDependencies) {
    return function StepRecorder(props: TestStepProps) {

        const [isActive, setIsActive] = React.useState<boolean>(false)
        const [isWaitingForSelection, setIsWaitingForSelection] = React.useState(false)
        function select() {
            setIsWaitingForSelection(true)
            log.log('Waiting...')
            board.unselectAll()
            board.showNotification(selectionWaitingMessage);
            board.onNextSingleSelection((selectedWidget: SelectedStep) => {
                log.log(turn, 'Selected...')
                setIsWaitingForSelection(false)
                props.onStepSelection(selectedWidget)
                stepNavigator.done(turn)
            });
        }
        React.useEffect(() => {
            board.unselectAll();
            stepNavigator.onTurn(turn, () => {
                setIsActive(true)
                log.log('Waiting...')
                select()
            });
        }, [])


        const onPropertyValueTextChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            (props.step!.stepSchema.properties[index] as singularProperty).example
                = event.currentTarget.value;
        }

        return (
            <div className={styles["step"]}>
                {/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }}>{stepType} </h3> */}
                <button title={"Select " + stepType}
                    onClick={select}

                    className={sharedStyles["image-button"]
                        + " miro-btn miro-btn--secondary miro-btn--small"}
                    style={{ display: stepType != '' ? 'flex' : 'none' }}
                    disabled={!isActive}>
                    <svg className={sharedStyles["image-button-image"]} width="20px" viewBox="0 0 24 24">
                        <path fill={isActive && isWaitingForSelection ? "#7187fc" : ""}
                            d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
                    </svg>
                    <h4 className={sharedStyles["image-button-text"]}>
                        {stepType}
                    </h4>
                </button>
                {
                    (!props.step?.stepSchema) ? <div className={styles["waiting-for-step"]} style={{ display: isActive ? 'block' : 'none' }}> <h1 >?</h1> </div> :

                        <div style={props.step?.widgetSnapshot.style}>
                            <span className={styles["step-title"]}>{props.step?.stepSchema.title}</span>

                            <div className={styles["key-value-row"]}>
                                {Object.entries(props.step?.stepSchema.properties)?.map(
                                    ([title, property], index) => <div className={styles["step-data-properties"]} key={`${property}~${index}`}>
                                        <label className={styles["property-key"]}>{title}</label>

                                        <PropertyComponent
                                            property={property}
                                            onTextChanged={e => onPropertyValueTextChange(index, e)} />


                                    </div>
                                )}
                            </div>
                        </div>
                }
            </div >
        );
    };
}
// eslint-disable-next-line no-unused-vars
function PropertyComponent(props: { property: prop, onTextChanged: ((event: React.ChangeEvent<HTMLInputElement>) => void) }) {
    return ((props.property as arrayProperty).items)
        ?
        <ArrayPropertyComponent
            arrayProperty={props.property as arrayProperty}
            onTextChanged={props.onTextChanged} />
        :
        <SingularPropertyComponent
            property={props.property as singularProperty}
            onTextChanged={props.onTextChanged} />
}
// eslint-disable-next-line no-unused-vars
function SingularPropertyComponent(props: { property: singularProperty, onTextChanged: ((event: React.ChangeEvent<HTMLInputElement>) => void) }) {
    return <input readOnly={false} onChange={props.onTextChanged}
        className={styles["property-value"]
            + " miro-input miro-input--small miro-input--primary"}
        type="text" value={props.property.example}
        disabled={true}>
    </input>
}

// eslint-disable-next-line no-unused-vars
function ArrayPropertyComponent(props: { arrayProperty: arrayProperty, onTextChanged: ((event: React.ChangeEvent<HTMLInputElement>) => void) }) {
    return <div style={{ paddingLeft: '14px', width: '115px' }}>
        [{
            props.arrayProperty.items.map((item, i) =>
                <PropertyComponent
                    key={i}
                    property={item as singularProperty}
                    onTextChanged={e => props.onTextChanged(e)} />
            )
        }]
    </div>
}