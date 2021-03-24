import * as React from "react";
import { IBoard, SelectedWidget } from 'board';
import { singletonBoard } from "../global-dependency-container";
const board: IBoard = singletonBoard
export function SelectableText(props: {
    value: string,
    placeholder: string,
    disabled: boolean,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    errors: string[],
    className: string
}) {
    function onClick() {
        console.log('Waiting...')
        board.onNextSingleSelection((selectedWidget: SelectedWidget) => {
            props.value = selectedWidget.widgetData.type
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
                value={props.value} onChange={props.onChange}
                placeholder={props.placeholder} />

            {props.errors.map(error => <div key={error} className="status-text">{error}</div>)}
        </div>
    )
}