import styles from './scenario-builder.style.css'
import { singletonBoard } from '../../global-dependency-container';
import * as React from 'react';
import { Givens, OrderedSelectedStep } from './given-collection.component';
import { WhenStep as When } from './when-step';
import { ThenStep as Then } from './then-step';
import { SelectedStep } from '../iboard';
import { Save } from './scenario-builder.service';
import { queueingMachine } from './local-dependency-container';
import { getTemplateRepository } from '../template-processing/template-repository';
import { useEffect, useState } from 'react';
import { SelectableText } from './title-picker/title-picker.component';
import { TestStepTurn } from './step-picker/scenario-step-turn';
import { spec } from 'app/spec';


export const createTestRecorder = (board = singletonBoard
    , stepNavigator = queueingMachine
    , save = Save): React.FC<any> => () => {
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
        useEffect(() => {
            board.unselectAll()
                .then(stepNavigator.start);
            getTemplateRepository().then(repo => {
                repo.getAllTemplateNames().then(x => {
                    setAvailableTemplateNames(x)
                    selectTemplateName(x[0])
                }).catch(e => { throw e })
            })
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

            var viewModel = {
                sut: subject,
                context: context,
                scenario: scenario,
                givens: givens.map(given => given.step.stepSchema),
                when: when?.stepSchema,
                thens: [then?.stepSchema],
            } as spec
            try {
                await save(selectedTemplateName, viewModel)
                board.showNotification('Test created successfully.')
            } catch {
                board.showNotification('Test creation error try again later.\n')
            }
        };

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
                    <div className={styles["save"] + styles['full-width'] +
                        " input-group miro-input-group miro-input-group--small"}>
                        <select className="miro-select miro-select--secondary-bordered miro-select--small" value={selectedTemplateName}
                            onChange={(e) => selectTemplateName(e.target.value)}>
                            {availableTemplateNames.map((templateName) => (
                                <option key={templateName} value={templateName}>
                                    {templateName}
                                </option>
                            ))}
                        </select>
                        <button
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