import styles from './scenario-builder.style.css'
import * as React from 'react';
import { Givens, OrderedSelectedStep } from './given-collection.component';
import { WhenStep as When } from './when-step';
import { ThenStep as Then } from './then-step';
import { SelectedStep } from '../ports/iboard';
import { ScenarioBuilderService } from './scenario-builder.service';
import { queueingMachine } from './local-dependency-container';
import { useEffect, useState } from 'react';
import { SelectableText } from './title-picker/title-picker.component';
import { TestStepTurn } from './step-picker/scenario-step-turn';
import { spec } from '../../app/spec';
import { ExternalServices } from '../../external-services';

const templateRepository = ExternalServices.templateRepository
const tempSharedStorage = ExternalServices.tempSharedStorage
const boardService = ExternalServices.boardService

export const createTestRecorder = (board = ExternalServices.boardService): React.FC<any> => () => {
    if (!board) {
        //TODO: Implement guard
    }

    const [givens, recordGiven] = useState<OrderedSelectedStep[]>([]);
    const [when, recordWhen] = useState<SelectedStep>();
    const [then, recordThen] = useState<SelectedStep>();
    const [scenario, recordScenario] = useState<string>("");
    const [context, recordContext] = useState<string>("");
    const [subject, recordSubject] = useState<string>("");
    const [selectedTemplateName, selectTemplateName] = useState<string>("no template");
    const [availableTemplateNames, setAvailableTemplateNames] = useState<string[]>([]);


    function getRequiredErrorsFor(str: string): string[] {
        if (str.trim() == "")
            return ["Required!"]
        return []
    }
    function getMaxLengthErrorsFor(str: string, maxLen: 50): string[] {
        if (str.length > maxLen)
            return ["Too long!"]
        return []
    }

    function loadTemplateNames() {
        templateRepository.getAllTemplateNames().then(templateNames => {
            setAvailableTemplateNames(templateNames)
            selectTemplateName(templateNames[0])
        }).catch(e => { throw e })
    }

    useEffect(() => {
        board.unselectAll()
            .then(queueingMachine.start);
        loadTemplateNames()
    }, [])




    const notifyValidationError = (errorText: string) => {
        board.showNotification(errorText)
    }

    function validateContext(context: string): string[] {
        return [
            getRequiredErrorsFor(context),
            getMaxLengthErrorsFor(context, 50)
        ].flat()

    }
    function changeContext(context: string) {
        validateContext(context)
        recordContext(context)
    }



    function validateScenario(scenario: string): string[] {
        return [
            getRequiredErrorsFor(scenario),
            getMaxLengthErrorsFor(scenario, 50)
        ].flat()
    }
    function changeScenario(scenario: string) {
        validateScenario(scenario)
        recordScenario(scenario)
    }


    function validateSubject(subject: string): string[] {
        return [
            getRequiredErrorsFor(subject),
            getMaxLengthErrorsFor(subject, 50)
        ].flat()
    }
    function changeSubject(subject: string) {
        validateSubject(subject)
        recordSubject(subject)
    }


    function validateWhen(): boolean {
        if (!when) {
            notifyValidationError('No when selections. Please save the test after selecting the when step.')
            return false
        }
        return true
    }
    function validateThen(): boolean {
        if (!then) {
            notifyValidationError('No then selections. Please save the test after selecting the then step.')
            return true
        }
        return true
    }
    const forceUpdate = React.useReducer((bool) => !bool, true)[1];
    const saveAndRedirectToExplorer = async () => {
        var isFormValid = validateScenario(scenario)
            && validateContext(context)
            && validateSubject(subject)
            && validateThen()
            && validateWhen()
        forceUpdate()
        if (!isFormValid)
            return

        const testSpec = {
            sut: subject,
            context: context,
            scenario: scenario,
            givens: givens.map(given => given.step.stepSchema),
            when: when?.stepSchema,
            thens: [then?.stepSchema],
        } as spec
        try {
            await ScenarioBuilderService.Save(selectedTemplateName, testSpec)
            board.showNotification('Test created successfully.')
        } catch {
            board.showNotification('Test creation error try again later.\n')
        }
    };

    async function editTemplate() {
        const testSpec = {
            sut: subject,
            context: context,
            scenario: scenario,
            givens: givens.map(given => given.step.stepSchema),
            when: when?.stepSchema,
            thens: [then?.stepSchema],
        } as spec
        tempSharedStorage.setItem('sample-test-spec', testSpec)

        const queryString = `?templateName=${selectedTemplateName}`
        await boardService.openModal(`./monaco-editor.html${queryString}`)
            .then(loadTemplateNames)
    }

    return (
        <div className={styles["test-recorder"]}>
            <Givens onStepSelectionChange={recordGiven} steps={givens} />
            <When onStepSelection={recordWhen} step={when} />

            <SelectableText
                turn={TestStepTurn.Subject}
                title="Subject"

                value={scenario}
                className={styles["subject-input"]}
                onChange={x => changeSubject(x)}
                validate={validateSubject}
            />

            <Then onStepSelection={recordThen} step={then} />

            <SelectableText
                turn={TestStepTurn.Context}
                title="Context"

                value={context}
                className={styles["test-context-input"]}
                onChange={x => changeContext(x)}
                validate={validateContext}
            />

            <SelectableText
                turn={TestStepTurn.Scenario}
                title="Scenario"

                value={scenario}
                className={styles["scenario-input"]}
                onChange={x => changeScenario(x)}
                validate={validateScenario}
            />


            {scenario &&
                <div className={styles["template-selection-panel"] + ' ' + styles['full-width'] +
                    " input-group miro-input-group miro-input-group--small"}
                >
                    <button
                        title="Add a new template"
                        className={styles['svg-button'] + " miro-btn miro-btn--secondary miro-btn--small"}
                        onClick={() => alert('Not implemented yet.')}>
                        <svg height="20px" fill="currentColor" fillRule="nonzero" className="image-button" viewBox="0 0 48 48"><g><path d="M37,43c0,0.6-0.4,1-1,1H12c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h13V2H12c-1.7,0-3,1.3-3,3v38c0,1.7,1.3,3,3,3h24   c1.7,0,3-1.3,3-3V16h-2V43z"></path><polygon points="33,8 33,2 31,2 31,8 25,8 25,10 31,10 31,16 33,16 33,10 39,10 39,8  "></polygon><rect height="2" width="10" x="17" y="19"></rect><rect height="2" width="14" x="17" y="27"></rect><rect height="2" width="10" x="17" y="35"></rect></g></svg>
                    </button>
                    <select className={" miro-select miro-select--secondary-bordered miro-select--small"} value={selectedTemplateName}
                        onChange={(e) => selectTemplateName(e.target.value)}
                        style={{ width: '100%', border: 'unset' }}

                    >
                        {availableTemplateNames.map((templateName) => (
                            <option key={templateName} value={templateName}>
                                {templateName}
                            </option>
                        ))}
                    </select>
                    <button
                        title="Edit the template"
                        onClick={editTemplate}
                        className={" miro-btn miro-btn--secondary miro-btn--small " + styles['svg-button']}

                    >
                        <svg style={{ height: '20px' }} viewBox="0 0 32 32"><path d="M27,4H5C3.3,4,2,5.3,2,7v18c0,1.7,1.3,3,3,3h22c1.7,0,3-1.3,3-3V7C30,5.3,28.7,4,27,4z M9.1,7.6c0.1-0.1,0.1-0.2,0.2-0.3  c0.1-0.1,0.2-0.2,0.3-0.2C10,6.9,10.4,7,10.7,7.3c0.1,0.1,0.2,0.2,0.2,0.3C11,7.7,11,7.9,11,8c0,0.3-0.1,0.5-0.3,0.7  C10.5,8.9,10.3,9,10,9C9.7,9,9.5,8.9,9.3,8.7C9.1,8.5,9,8.3,9,8C9,7.9,9,7.7,9.1,7.6z M6,8c0-0.3,0.1-0.5,0.3-0.7  c0,0,0.1-0.1,0.1-0.1c0.1,0,0.1-0.1,0.2-0.1C6.7,7,6.7,7,6.8,7c0.1,0,0.3,0,0.4,0c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1  c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.3C8,7.7,8,7.9,8,8c0,0.1,0,0.3-0.1,0.4C7.9,8.5,7.8,8.6,7.7,8.7C7.5,8.9,7.3,9,7,9  S6.5,8.9,6.3,8.7C6.1,8.5,6,8.3,6,8z M11.7,21.3c0.4,0.4,0.4,1,0,1.4C11.5,22.9,11.3,23,11,23s-0.5-0.1-0.7-0.3l-3-3  c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L9.4,19L11.7,21.3z M12.6,8.9c-0.1-0.1-0.2-0.1-0.3-0.2  c-0.1-0.1-0.2-0.2-0.2-0.3C12,8.3,12,8.1,12,8c0-0.1,0-0.3,0.1-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0  c0.1,0.1,0.2,0.2,0.2,0.3C14,7.7,14,7.9,14,8c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C13.5,8.9,13.3,9,13,9  C12.9,9,12.7,9,12.6,8.9z M18.9,15.4l-4,8C14.7,23.8,14.4,24,14,24c-0.2,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.4-1.3l4-8  c0.2-0.5,0.8-0.7,1.3-0.4C18.9,14.4,19.1,15,18.9,15.4z M24.7,19.7l-3,3C21.5,22.9,21.3,23,21,23s-0.5-0.1-0.7-0.3  c-0.4-0.4-0.4-1,0-1.4l2.3-2.3l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3,3C25.1,18.7,25.1,19.3,24.7,19.7z"></path></svg>
                    </button>
                    <button
                        title="Generate the test and download it"
                        style={{ margin: '0px' }}
                        className='miro-btn miro-btn--primary miro-btn--small'
                        onClick={saveAndRedirectToExplorer}
                    // disabled={[errors].flat().length > 0}
                    >Save</button>
                </div>
            }


        </div>
    );
}


export let TestRecorder = createTestRecorder()