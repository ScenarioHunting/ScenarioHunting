import * as React from "react";
import { IBoard, SelectedWidget } from 'board';
import { singletonBoard } from "../global-dependency-container";
import { TestStepTurn } from "../test-factory/test-step-turn";
import { singletonStepNavigator } from "../test-factory/local-dependency-container";

const board: IBoard = singletonBoard
// const turn = TestStepTurn.Subject
const queue = singletonStepNavigator
export function SelectableText(props: {
    value: string,
    placeholder: string,
    turn: TestStepTurn,
    // eslint-disable-next-line no-unused-vars
    onChange: (newValue: string) => void,
    className: string,
    title: string,
    // eslint-disable-next-line no-unused-vars
    validate: (_: string) => string[]
}) {
    const [value, setValue] = React.useState(props.value)
    const [isActive, setIsActive] = React.useState<boolean>(false)
    const [errors, setErrors] = React.useState<string[]>([])

    // function validate(val: string): boolean {
    //     var errors = [getRequiredErrorsFor(scenario), getMaxLengthErrorsFor(scenario, 50)].flat()
    //     setErrors(errors)
    //     return errors.length == 0
    // }
    // var isInSelectMode = true
    function onChange(newValue) {
        //TODO: unsubscribe from board.selection
        setErrors(props.validate(newValue))
        setValue(newValue)
        props.onChange(newValue)

        // if (isInSelectMode) {
        queue.done(props.turn)
        //     isInSelectMode = false
        // }
    }

    function select() {
        console.log('Waiting...')
        board.unselectAll()
        board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
            // isInSelectMode = true
            onChange(selectedWidget.widgetData.type)
            console.log(props.value + ' selected')
        });
    }
    React.useEffect(() => {
        board.unselectAll();
        queue.onTurn(props.turn, () => {
            setIsActive(true)
            console.log('Waiting...')
            select()
            // board.onNextSingleSelection(selectedWidget => {
            //     console.log(props.turn, 'Done...')
            //     onChange(selectedWidget.widgetData.type)
            // });
        });
    }, [props.turn])
    // }, [isInSelectMode, props.turn])




    return (
        <div style={{ display: isActive ? 'block' : 'none' }}
            className={"miro-input-field " + (errors.length == 0 ? "" : "miro-input-field--invalid")}>

            {/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }} >{props.title}</h3> */}
            <div className={props.className + " input-group miro-input-group miro-input-group--small " + (errors.length == 0 ? "" : "miro-input-group--invalid")}>
                {/* <button
                    className='miro-btn miro-btn--primary miro-btn--small'
                    onClick={select}
                // disabled={props.clickDisabled}
                >Select</button> */}

                <button onClick={select}
                    className="image-button miro-btn miro-btn--primary miro-btn--small"
                    style={{ display: "flex", marginTop: '6px', marginBottom: '6px' }}>
                    <svg style={{ width: '15px', fill:'#fff' }} viewBox="0 0 24 24">
                        <path d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
                    </svg>
                    <h3 style={{ margin: '0px !important' }}>{props.title}</h3>
                </button>


                <input type='text'
                    className="full-width miro-input miro-input--primary"
                    value={value} onChange={x => onChange(x.target.value)}
                    placeholder={props.placeholder} />

            </div>
            {errors.map(error => <div key={error} className="status-text">{error}</div>)}

        </div>
    )
}