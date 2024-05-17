import * as sharedStyles from '../step-picker/scenario-step-shared.styles.css';
import * as React from 'react';
import { SelectedStep } from '../../ports/iboard';
import { TestStepTurn } from '../step-picker/scenario-step-turn';
import { queueingMachine } from '../local-dependency-container';
import { ExternalServices, log } from '../../../external-services';
const boardService = ExternalServices.boardService;

export function SelectableText(props: {
    
    value: string,
    turn: TestStepTurn,
    onChange: (_newValue: string) => void,
    className: string,
    title: string,
    validate: (_: string) => string[]
}) {
  const [value, setValue] = React.useState(props.value);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isWaitingForSelection, setIsWaitingForSelection] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const onChange = React.useCallback((newValue: string) => {
        
    setIsWaitingForSelection(false);
    setErrors(props.validate(newValue));
    setValue(newValue);
    props.onChange(newValue);
    queueingMachine.done(props.turn);
  },[props]);

  const select = React.useCallback(()=> {
    setIsWaitingForSelection(true);
    log.log('Waiting...');
    boardService.unselectAll();
    boardService.onNextOneSelection((selectedWidget: SelectedStep) => {
      log.log(props.turn, 'Selected...');
      onChange(selectedWidget.step.title);
      log.log(props.value + ' selected');
    });
  },[onChange, props.turn, props.value]);

  React.useEffect(() => {
    setErrors(props.validate(props.value));
    boardService.unselectAll();
    queueingMachine.onTurn(props.turn, () => {
      setIsActive(true);
      log.log('Waiting...');
      select();
    });
  }, [props, props.turn, select]);




  return (
    <div style={{ display: isActive ? 'block' : 'none', marginTop: '6px', marginBottom: '6px' }}

      className={'miro-input-field ' + (errors.length == 0 ? '' : 'miro-input-field--invalid')}>

      {/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }} >{props.title}</h3> */}
      <div className={props.className ?? '' + ' input-group miro-input-group miro-input-group--small ' + (errors.length == 0 ? '' : 'miro-input-group--invalid')}
        style={{ width: '100%' }}

      >
        {/* <button
                    className='miro-btn miro-btn--primary miro-btn--small'
                    onClick={select}
                // disabled={props.clickDisabled}
                >Select</button> */}

        <button onClick={select} title={'Select or type the ' + props.title}
          className={sharedStyles['image-button'] + ' miro-btn miro-btn--secondary miro-btn--small'}
          disabled={!isActive}

        >
          <svg className={sharedStyles['image-button-image']} width="20px" viewBox="0 0 24 24">
            <path fill={isActive && isWaitingForSelection ? '#7187fc' : ''}
              d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
          </svg>
          <h4 className={sharedStyles['image-button-text']}>
            {props.title}
          </h4>
        </button>


        <input type='text'
          className="full-width miro-input miro-input--primary"
          value={value} onChange={x => onChange(x.target.value)}
          placeholder='?'
          style={{ width: '100%' }}
        />

      </div>
      {errors.map(error => <div key={error} className="status-text">{error}</div>)}

    </div>
  );
}