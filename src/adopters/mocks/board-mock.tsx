/* eslint-disable no-unused-vars */
import { IBoard, SelectedStep, WidgetSnapshot } from "app/ports/iboard";

import * as React from 'react';

class BoardMock implements IBoard {
    updateWidgetText = (widgetId: string, newWidgetText: string): Promise<void> =>
        Promise.resolve(alert('The widget with Id: ' + widgetId + ' updated with text: ' + newWidgetText))

    getWidgetText = function (widgetId: string): Promise<string> {
        this.showStatus('Returning widget text for widget id:\n' + widgetId)
        return Promise.resolve('Widget Id')
    }
    public select: (selected: SelectedStep) => void;
    public showStatus: (message: string) => void = () => { }

    onNextSingleSelection = function (callback: (selected: SelectedStep) => void) {
        this.select = callback
    }
    interceptPossibleTextEdit = function (updateText: (widgetId: string, updatedWidget: string) => Promise<string>) {
        this.showStatus('Text edit interception registered')
    }
    unselectAll: () => Promise<void> = () =>
        Promise.resolve(this.showStatus('All widgets are unselected.'))


    showNotification: (message: string) => Promise<void> = (message) =>
        Promise.resolve(this.showStatus('Notification message:\n' + message))

    openModal(iframeURL: string, options?: { width?: number; height?: number } | { fullscreen: boolean }): Promise<any> {
        document!.getElementById("modal-dark-background")!.style.display = "block";
        document!.getElementById("modal")!.style.display = "block";
        (document!.getElementById('modal-iframe')! as HTMLIFrameElement).src = iframeURL;
        document!.getElementById('modal-dark-background')!.onclick = function () {
            document.getElementById("modal")!.style.display = "none";
            document.getElementById("modal-dark-background")!.style.display = "none";
        };

        // window.onkeydown = function (e) {
        //     if (e.keyCode == 27) {
        //         // @ts-ignore: Object is possibly 'null'.
        //         document.getElementById("modal").style.display = "none";
        //         // @ts-ignore: Object is possibly 'null'.
        //         document.getElementById("modal-dark-background").style.display = "none";
        //         e.preventDefault();
        //         return;
        //     }
        // }

        return Promise.resolve()
    }

    zoomTo: (widget: WidgetSnapshot) => void = (widget: WidgetSnapshot) =>
        this.showStatus('Zooming to:\n' + widget.id)


}

const board = new BoardMock()
export function MockBoard(): IBoard {
    return board
}

export function UIComponent() {
    const [statusMessage, setStatusMessage] = React.useState("status")
    board.showStatus = message => setStatusMessage(message)
    const [step, changeStep] = React.useState<string>(JSON.stringify({
        stepSchema: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            title: "Customer registered",
            properties: {
                customer_id: {
                    type: "string",
                    description: "customer_id",
                    example: "customerId"
                },
                newAddress: {
                    type: "string",
                    description: "new address",
                    example: "Oak street"
                },
                NewPhone_number: {
                    type: "string",
                    description: "New phonenumber",
                    example: "+44555112100"
                }
            }
        },
        widgetSnapshot: {
            id: "3074457354846911652",
            style: {
                backgroundColor: "#ff9d48"
            }
        }

    }, null, 2))
    function select() {
        if (!step) {
            alert("No selection!")
            return
        }
        const selected: SelectedStep = JSON.parse(step)
        if (!selected) {
            alert("Invalid format.")
            return
        }
        board.select(selected)
    }
    return <div style={{ width: '100%', backgroundColor: 'rebeccapurple', marginLeft: '10px' }}>
        <textarea
            style={{ width: '99%', height: '512px' }}
            onChange={x => changeStep(x.target.value)} value={step}>
        </textarea>
        <button style={{ width: '99%' }}
            onClick={select}>Select</button>

        <pre style={{
            backgroundColor: '#4262ff',
            color: 'white',
            marginBottom: 'auto'
        }}
        >{statusMessage}</pre>
        <div id="modal" style={{
            display: 'none',
            position: 'fixed',
            top: '12%',
            left: '15%',
            width: '70%',
            height: '70%',
            backgroundColor: 'white',
            zIndex: 10
        }}>
            <iframe id="modal-iframe" style={{
                width: '100%',
                height: '100%',
                border: 0
            }}>
            </iframe>
        </div>
        <div id="modal-dark-background" style={{
            position: 'fixed',
            zIndex: 5,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,.75)',
            display: 'none'
        }}></div>
    </div >
}
export class BoardUi {
    component = UIComponent;
}
