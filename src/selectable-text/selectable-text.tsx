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
    var isInSelectMode = false
    function onChange(newValue) {
        //TODO: unsubscribe from board.selection
        setErrors(props.validate(newValue))
        setValue(newValue)
        props.onChange(newValue)

        if (isInSelectMode) {
            queue.done(props.turn)
            isInSelectMode = false
        }
    }

    function select() {
        console.log('Waiting...')
        board.unselectAll()
        board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
            onChange(selectedWidget.widgetData.type)
            console.log(props.value + ' selected')
            isInSelectMode = true
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
    }, [isInSelectMode, props.turn])




    return (
        <>
            <div style={{ display: isActive ? 'flex' : 'none' }} className={"miro-input-field " + (errors.length == 0 ? "" : "miro-input-field--invalid")}>
                <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }} >{props.title}</h3>
                <div className={props.className + " input-group miro-input-group miro-input-group--small " + (errors.length == 0 ? "" : "miro-input-group--invalid")}>
                    <button
                        className='miro-btn miro-btn--primary miro-btn--small'
                        onClick={select}
                    // disabled={props.clickDisabled}
                    >Select</button>
                    <input type='text'
                        className="full-width miro-input miro-input--primary"
                        value={value} onChange={x => onChange(x.target.value)}
                        placeholder={props.placeholder} />

                    {errors.map(error => <div key={error} className="status-text">{error}</div>)}
                </div>
            </div>
        </>
    )
}