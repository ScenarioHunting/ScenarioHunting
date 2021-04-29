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
import { spec } from 'app/spec';
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
        // await 
        boardService.openModal(`./monaco-editor.html${queryString}`, { fullscreen: true })
            .then(() => {
                loadTemplateNames()
                // )
                // .finally(() => 
                tempSharedStorage.removeItem('sample-test-spec')
            })
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
                <div className={styles["save"] + ' ' + styles['full-width'] +
                    " input-group miro-input-group miro-input-group--small"}
                    style={{ width: '100%' }}

                >
                    <button className="miro-btn miro-btn--primary miro-btn--small">Add</button>
                    <select className="miro-select miro-select--secondary-bordered miro-select--small" value={selectedTemplateName}
                        onChange={(e) => selectTemplateName(e.target.value)}
                        style={{ width: '100%' }}

                    >
                        {availableTemplateNames.map((templateName) => (
                            <option key={templateName} value={templateName}>
                                {templateName}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={editTemplate}
                        className="miro-btn miro-btn--primary miro-btn--small">Edit</button>
                    <button
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