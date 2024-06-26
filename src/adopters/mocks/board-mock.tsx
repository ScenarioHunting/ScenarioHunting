/* eslint-disable no-unused-vars */
import { IBoard, ModalOptions, ModalResult, SelectedStep, WidgetSnapshot } from '../../app/ports/iboard';

import * as React from 'react';
import { Step } from '../../app/api';

class BoardMock implements IBoard {
  getModalParameters<T>(): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }
  getWidgetText = function (widgetId: string): Promise<string> {
    this.showStatus('Returning widget text for widget id:\n' + widgetId);
    return Promise.resolve('Widget Id');
  };
  public select: (selected: SelectedStep) => void = () => { };
  public showStatus: (message: string) => void = () => { };

  onNextOneSelection = function (callback: (selected: SelectedStep) => void) {
    this.select = callback;
  };

  unselectAll: () => Promise<void> = () =>
    Promise.resolve(this.showStatus('All widgets are unselected.'));


  showNotification: (message: string) => Promise<void> = (message) =>
    Promise.resolve(this.showStatus('Notification message:\n' + message));

  openModal<Data, Result>({ url, parameters: data }: ModalOptions<Data>): Promise<ModalResult<Result>> {
    const modal = document!.getElementById('modal');
    const modalDarkBackground = document.getElementById('modal-dark-background');

        modalDarkBackground!.style.display = 'block';
        modal!.style.display = 'block';
        (document!.getElementById('modal-iframe')! as HTMLIFrameElement).src = url;

        modalDarkBackground!.onclick = function () {
            modal!.style.display = 'none';
            modalDarkBackground!.style.display = 'none';
        };
        window.onkeydown = function (e) {
          if (e.keyCode == 27) {
            if (document && document!.getElementById('modal')) {
                    document!.getElementById('modal')!.style.display = 'none';
                    document!.getElementById('modal-dark-background')!.style.display = 'none';
                    return;
            }
                window.parent.document.getElementById('modal')!.style.display = 'none';
                window.parent.document.getElementById('modal-dark-background')!.style.display = 'none';
                // this.closeModal()
                e.preventDefault();
                return;
          }
        };
        const x: ModalResult<Result> = { waitForClose: () => { return Promise.reject(); } };
        return Promise.resolve(x);
  }
  closeModal() {
    if (document && document!.getElementById('modal')) {
            document!.getElementById('modal')!.style.display = 'none';
            document!.getElementById('modal-dark-background')!.style.display = 'none';
            return;
    }
        window.parent.document.getElementById('modal')!.style.display = 'none';
        window.parent.document.getElementById('modal-dark-background')!.style.display = 'none';
  }
  zoomTo: (widget: WidgetSnapshot) => void = (widget: WidgetSnapshot) =>
    this.showStatus('Zooming to:\n' + widget.id);


}

const board = new BoardMock();
export function MockBoard(): IBoard {
  return board;
}

export function UIComponent() {
  const [statusMessage, setStatusMessage] = React.useState('status');
  board.showStatus = message => setStatusMessage(message);
  const [step, changeStep] = React.useState<string>(JSON.stringify({
    // example: {
    //     customer_id: "customerId",
    //     newAddress: "Oak street",
    //     number_sample: 23,
    //     bool_sample: false,
    //     tuple_sample: [
    //         "str",
    //         12
    //     ],
    //     array_sample: [
    //         "1st item",
    //         "2nd item"
    //     ],
    //     NewPhone_number: "+44555112100"
    // },
    step: {
      title: 'Customer registered',
      schema: {
        type: 'object',
        properties: {
          customer_id: {
            type: 'string',
            description: 'customer_id',
            example: 'customerId'
          },
          newAddress: {
            type: 'string',
            description: 'new address',
            example: 'Oak street'
          },
          number_sample: {
            type: 'number',
            description: 'num sample',
            example: 23
          },
          bool_sample: {
            type: 'boolean',
            description: 'boolean sample',
            example: false
          },
          array_sample: {
            type: 'array',
            description: 'array_sample',
            items: {
              type: 'string',
              description: '1st item',
              example: '1st item'
            }
          },
          tuple_sample: {
            type: 'array',
            description: 'array_sample',
            items: [
              {
                type: 'string',
                description: '1st item',
                example: '1st item'
              },
              {
                type: 'number',
                description: '2nd item',
                example: '2nd item'
              }
            ]
          },
          NewPhone_number: {
            type: 'string',
            description: 'New phonenumber',
            example: '+44555112100'
          }
        }
      },
      example: {
        customer_id: 'customerId',
        newAddress: 'Oak street',
        number_sample: 23,
        bool_sample: false,
        tuple_sample: [
          'str',
          12
        ],
        array_sample: [
          '1st item',
          '2nd item'
        ],
        NewPhone_number: '+44555112100'
      },
    },
    widgetSnapshot: {
      id: '3074457354846911652',
      style: {
        backgroundColor: '#ff9d48'
      }
    },
  } as SelectedStep, null, 2));
  function select() {
    if (!step) {
      alert('No selection!');
      return;
    }
    const selected: SelectedStep = JSON.parse(step);
    if (!selected) {
      alert('Invalid format.');
      return;
    }
    board.select(selected);
  }
  return <div style={{
    width: '100%',
    backgroundColor: '#454545',
    marginLeft: '10px'
  }}>
    <h4 style={{
      backgroundColor: 'white',
      textAlign: 'center',
      margin: '0px'
    }}>Widget Data To Be Selected</h4>
    <textarea
      style={{
        width: '100%',
        height: '512px',
        backgroundColor: '#454545',
        color: '#ffffffd9',
        borderStyle: 'none'
      }}
      onChange={x => changeStep(x.target.value)} value={step}>
    </textarea>
    <button style={{ width: '100%', height: '36px' }}
      onClick={select}>Select</button>

    <pre style={{
      backgroundColor: '#4262ff',
      color: 'white',
      marginBottom: 'auto',
      margin: '0px'
    }}




    >{statusMessage}</pre>
    <div id="modal" style={{
      display: 'none',
      position: 'fixed',
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
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
  </div >;
}
export class BoardUi {
  component = UIComponent;
}
