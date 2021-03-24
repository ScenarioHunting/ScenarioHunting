import * as React from "react";
import { IBoard, SelectedWidget } from 'board';
import { singletonBoard } from "../global-dependency-container";
const board: IBoard = singletonBoard
export function SelectableText(props: {
    value: string,
    placeholder: string,
    disabled: boolean,
    // eslint-disable-next-line no-unused-vars
    onChange: (value:string) => void,
    errors: string[],
    className: string
}) {
    const [value, setValue] = React.useState(props.value)
    function onChange(newValue) {
        setValue(newValue)
        props.onChange(newValue)
        props.value = newValue
    }
    function onClick() {
        console.log('Waiting...')
        board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
            onChange(selectedWidget.widgetData.type)
            console.log(props.value + ' selected')
        });
    }

    return (
        <div className={props.className + " miro-input-group miro-input-group--small" + (props.errors.length == 0 ? "" : "miro-input-group--invalid")}>
            <button
                className='miro-btn miro-btn--primary miro-btn--small'
                onClick={onClick}
                disabled={props.disabled}
            >Select</button>
            <input type='text'
                className={"miro-input miro-input--primary"}
                value={value} onChange={onChange}
                placeholder={props.placeholder} />

            {props.errors.map(error => <div key={error} className="status-text">{error}</div>)}
        </div>
    )
}