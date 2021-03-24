import * as React from "react";
import { IBoard, SelectedWidget } from 'board';
import { singletonBoard } from "../global-dependency-container";
const board: IBoard = singletonBoard
export function SelectableText(props: {
    value: string,
    placeholder: string,
    clickDisabled: boolean,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void,
    errors: string[],
    className: string
}) {
    const [value, setValue] = React.useState(props.value)
    function onChange(newValue) {
        setValue(newValue)
        props.onChange(newValue)
    }
    function onClick() {
        console.log('Waiting...')
        board.unselectAll()
        board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
            onChange(selectedWidget.widgetData.type)
            console.log(props.value + ' selected')
        });
    }
    return (
        <div className={"miro-input-field " + (props.errors.length == 0 ? "" : "miro-input-field--invalid")}>
            <div className={props.className + " input-group miro-input-group miro-input-group--small " + (props.errors.length == 0 ? "" : "miro-input-group--invalid")}>
                <button
                    className='full-width miro-btn miro-btn--primary miro-btn--small'
                    onClick={onClick}
                    disabled={props.clickDisabled}
                >Select</button>
                <input type='text'
                    className="miro-input miro-input--primary"
                    value={value} onChange={x => onChange(x.target.value)}
                    placeholder={props.placeholder} />

                {props.errors.map(error => <div key={error} className="status-text">{error}</div>)}
            </div>
        </div>
    )
}