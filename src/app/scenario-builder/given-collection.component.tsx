import * as sharedStyles from './step-picker/scenario-step-shared.styles.css';
import { queueingMachine } from './local-dependency-container';
import * as React from 'react';
import { TestStepTurn } from './step-picker/scenario-step-turn';
import { GivenStep } from './given-step';
import { SelectedStep } from '../ports/iboard';
import { log } from '../../external-services';

export type OrderedSelectedStep = {
    index: number
    step: SelectedStep
}
export type GivenStepsProps = {
    // eslint-disable-next-line no-unused-vars
    onStepSelectionChange: (stepResults: OrderedSelectedStep[]) => void
    steps?: OrderedSelectedStep[]
}
export let createGivenStepCollection =
    (stepNavigator = queueingMachine) =>
      (props: GivenStepsProps) => {

        const [canAdd, setCanAdd] = React.useState<boolean>(false);
        const [isActive, setIsActive] = React.useState<boolean>(false);
        const [isWaitingForSelection, setIsWaitingForSelection] = React.useState(false);
        const [indexedSteps, setIndexedSteps] = React.useState<OrderedSelectedStep[]>([]);

        React.useEffect(() => {
          stepNavigator.onTurn(TestStepTurn.Given, () => {
            setIsActive(true);
            setCanAdd(true);
            if (props.steps)
              setIndexedSteps(props.steps);
          });
        }, [props.steps]);


        let nextId: number = 1;
        const add = () => {
          if (!canAdd || indexedSteps.length > 9)
            return;
          setIsWaitingForSelection(true);
          setIndexedSteps([{ index: nextId } as OrderedSelectedStep, ...indexedSteps]);
          nextId++;

          setCanAdd(false);
          log.log('add: can add=', canAdd);
        };

        const onStepSelection = (updatedStep: SelectedStep) => {
          setCanAdd(true);
          log.log('New given selection: can add=', canAdd);
          setIsWaitingForSelection(false);
          const replaceOldIfEqual = (oldStep: OrderedSelectedStep, updatedStep: SelectedStep) => {

            const oldEqualsNew: boolean = oldStep.step == undefined
                        || oldStep.step.widgetSnapshot.id === updatedStep.widgetSnapshot.id;

            return oldEqualsNew
              ? { step: updatedStep, index: oldStep.index } as OrderedSelectedStep
              : oldStep;
          };

          const updatedSteps = indexedSteps.map(oldStep =>
            replaceOldIfEqual(oldStep, updatedStep));

          setIndexedSteps([...updatedSteps]);

          props.onStepSelectionChange(updatedSteps);
        };
        return (
          <div>
            {/* <h3 style={{ color: isActive ? 'inherit' : '#c3c2cf' }}>Given({indexedSteps.length})</h3>
                    <button
                        style={{ display: isActive ? 'block' : 'none' }}
                        className="add-step-button miro-btn miro-btn--small miro-btn--secondary"
                        disabled={!isActive || !canAdd || indexedSteps.length > 9}
                        onClick={add}>
                        + Given
                    </button> */}
            <button title="Add a new Given step" onClick={add}
              className={sharedStyles['image-button'] +
                            ' miro-btn miro-btn--secondary miro-btn--small'}
              disabled={!isActive || !canAdd || indexedSteps.length > 9}>
              <svg className={sharedStyles['image-button-image']} width="20px" viewBox="0 0 24 24">
                <path fill={isActive && isWaitingForSelection ? '#7187fc' : ''} d="M1.7,8.2l4.9,3.5L0.3,18c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.4,0.4,1,0.4,1.4,0l6.4-6.4l3.5,5L24,0L1.7,8.2z M15.1,17.3L12.8,14  l-7.5,7.5l-2.8-2.8l7.5-7.5L6.7,8.9l13.6-5.1L15.1,17.3z" ></path>
              </svg>
              <h4 className={sharedStyles['image-button-text']}>
                            +Given({indexedSteps.length})
              </h4>
            </button>

            {
              indexedSteps.map((data,index) =>
                <GivenStep
                  onStepSelection={onStepSelection}
                  step={data.step}
                  key={index}
                />)
            }
            {indexedSteps.length > 9 &&
                        <div className={sharedStyles['status-text']}>More than 10 given steps are not allowed</div>
            }


          </div>);

      };


export const Givens = createGivenStepCollection();