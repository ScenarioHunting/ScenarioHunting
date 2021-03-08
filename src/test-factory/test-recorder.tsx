import { singletonBoard } from '../global-dependency-container';
import * as React from 'react';
import { Givens, IndexedStep } from './given-collection';
import { WhenStep as When } from './when-step';
import { ThenStep as Then } from './then-step';
import { navigate } from "@reach/router"
import { ExampleWidget, SelectedWidget } from 'board';
import { Save, LocalTestCreationResult } from './test-recorder-http-service';
import { singletonStepNavigator } from './local-dependency-container';
import { getTemplateRepository } from './template-repository';
import { useEffect, useState } from 'react';

export type StepInfo = {
    type: string
    widget: ExampleWidget
}
export type ViewModel = {
    givens: StepInfo[]
    when: StepInfo
    then: StepInfo
    testName: string
    testContext: string
    sutName: string
}
export const createTestRecorder = (board = singletonBoard
    , stepNavigator = singletonStepNavigator
    , save = Save): React.FC<any> => () => {
        if (!board) {
            //TODO: Implement guard
        }

        const [givens, recordGiven] = useState<IndexedStep[]>([]);
        const [when, recordWhen] = useState<SelectedWidget>();
        const [then, recordThen] = useState<SelectedWidget>();
        const [scenario, recordScenario] = useState<string>("");
        const [context, recordContext] = useState<string>("");
        const [subject, recordSubject] = useState<string>("");
        const [selectedTemplateName, selectTemplateName] = useState<string>("no template");
        const [availableTemplateNames, setAvailableTemplateNames] = useState<string[]>([]);
        const [scenarioErrors, setScenarioErrors] = useState<string[]>([])
        const [contextErrors, setContextErrors] = useState<string[]>([])
        const [subjectErrors, setSubjectErrors] = useState<string[]>([])

        // const [generalErrors, setGeneralErrors] = useState<string[]>([])

        function getRequiredErrorsFor(context: string): string[] {
            if (context == "")
                return ["Required!"]
            return []
        }
        function getMaxLengthErrorsFor(context: string, maxLen: 50): string[] {
            if (context.length > maxLen)
                return ["Too long"]
            return []
        }
        // function changeContext(context: string) {
        //     validateContext(context)
        //     recordContext(context)
        // }
        // React.useCallback(() => {
        //     if (subject == "") {
        //         setSubjectErrors("Subject under test is required!")
        //     }
        // }, [subject])
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

        // var isTestNameStale = React.useRef(true)
        // useEffect(() => {
        //     if (testName != "") {
        //         isTestNameStale.current = false
        //         return
        //     }
        //     if (typeof when?.widgetData.type != 'undefined'
        //         && typeof then?.widgetData.type != 'undefined'
        //         && isTestNameStale.current) {
        //         var defaultTestName = when?.widgetData.type + '_' + then?.widgetData.type
        //         recordTestName(defaultTestName)
        //     }
        // }, [when, then, testName, isTestNameStale])
        const updateGivens = (givenResults: IndexedStep[]) => {
            recordGiven(givenResults);
        };
        const updateWhen = (when: SelectedWidget) => {
            recordWhen(when);
        };
        const updateThen = (then: SelectedWidget) => {
            recordThen(then)
        };
        const notifyValidationError = (errorText: string) => {
            board.showNotification(errorText)
        }
        var [canSave, setCanSave] = useState(true)
        function validateContext() {
            var contextErrors = [getRequiredErrorsFor(context), getMaxLengthErrorsFor(context, 50)].flat()
            if (contextErrors.length > 0) {
                setContextErrors(contextErrors)
                setCanSave(false)
            }
        }
        function validateSubject() {
            var scenarioErrors = [getRequiredErrorsFor(scenario), getMaxLengthErrorsFor(scenario, 50)].flat()
            if (scenarioErrors.length > 0) {
                setScenarioErrors(scenarioErrors)
                setCanSave(false)
            }
        }
        function validateScenario() {
            var subjectErrors = [getRequiredErrorsFor(subject), getMaxLengthErrorsFor(subject, 50)].flat()
            if (subjectErrors.length > 0) {
                setSubjectErrors(subjectErrors)
                setCanSave(false)
            }
        }
        function validateWhen() {
            if (!when) {
                notifyValidationError('No when selections. Please save the test after selecting the when step.')
                setCanSave(false)
            }
        }
        function validateThen() {
            if (!then) {
                notifyValidationError('No then selections. Please save the test after selecting the then step.')
                setCanSave(false)
            }
        }
        function validate() {
            validateWhen()
            validateThen()
            validateScenario()
            validateSubject()
            validateContext()
            return canSave
        }
        const saveAndRedirectToExplorer = async () => {
            validate()
            if (!canSave) {
                return
            }


            try {
                await save(selectedTemplateName, {
                    testContext: context,
                    testName: scenario,
                    sutName: subject,

                    givens,
                    when,
                    then
                } as LocalTestCreationResult)
                board.showNotification('Test created successfully.')
            } catch {
                board.showNotification('Test creation error try again later.\n')
            }

            const toViewModel = (step: SelectedWidget): StepInfo => {
                return {
                    type: step.widgetData.type,
                    widget: step.widgetSnapshot
                }
            }
            if (!when || !then) return
            var viewModel: ViewModel = {
                testContext: context
                , sutName: subject
                , testName: scenario
                , givens: givens.map(step => toViewModel(step.step))
                , when: toViewModel(when)
                , then: toViewModel(then)
            }

            await navigate('/test-explorer', { state: { newTest: viewModel } })
        };

        // function getClassNamesForRequiredValue(value: string) {
        //     const classNames = "miro-input miro-input--small miro-input--primary"
        //     const invalidClassName = "miro-input-field--invalid"
        //     if (value.trim() == "")
        //         return " " + classNames + " " + invalidClassName
        //     return " " + classNames + " miro-input--success"
        // }
        return (
            <div className="test-recorder">

                <div className="given">
                    <Givens onStepSelectionChange={updateGivens} steps={givens} />
                </div >

                <div className="when">
                    <When onStepSelection={updateWhen} step={when} />
                </div>

                <div className="then">
                    <Then onStepSelection={updateThen} step={then} />
                </div>
                {then &&
                    <div className="test-form-details">

                        <label className="test-name-label">Scenario:</label>
                        <div className={"test-name-input miro-input-field miro-input-field--small" + scenarioErrors == "" ? "miro-input-field--success" : "miro-input-field--invalid"}>

                            <input type='text'
                                className={"test-name-input  miro-input miro-input--primary"}
                                value={scenario} onChange={x => recordScenario(x.target.value)}
                                placeholder="Scenario" />

                            {scenarioErrors.map(error => <div key={error} className="status-text">{error}</div>)}
                        </div>

                        <label className="test-context-label">Context:</label>
                        <div className={"test-context-input miro-input-field miro-input-field--small" + contextErrors == "" ? "miro-input-field--success" : "miro-input-field--invalid"}>
                            <input type='text'
                                className={"test-context-input miro-input miro-input--primary"}
                                value={context} onChange={x => recordContext(x.target.value)}
                                placeholder="Context"
                            />
                            {contextErrors.map(error => <div key={error} className="status-text">{error}</div>)}
                        </div>

                        <label className="sut-label">Subject:</label>
                        <div className={"sut-input miro-input-field miro-input-field--small" + subjectErrors == "" ? "miro-input-field--success" : "miro-input-field--invalid"}>
                            <input type='text'
                                className={"sut-input  miro-input miro-input--primary"}
                                value={subject}
                                onChange={x => recordSubject(x.target.value)}
                                placeholder="Subject Under Test" />
                            <div className="status-text">{subjectErrors}</div>
                            {subjectErrors.map(error => <div key={error} className="status-text">{error}</div>)}
                        </div>



                        <div className="save-test miro-input-group miro-input-group--small">
                            {/* <label className="template-selector-label miro-select miro-select--small miro-select--primary-bordered">Template:</label> */}
                            <select className="template-selector miro-select miro-select--secondary-bordered miro-select--small" value={selectedTemplateName}
                                onChange={(e) => selectTemplateName(e.target.value)}>
                                {availableTemplateNames.map((templateName) => (
                                    <option key={templateName} value={templateName}>
                                        {templateName}
                                    </option>
                                ))}
                            </select>
                            <button
                                className='save-button save-button miro-btn miro-btn--primary miro-btn--small'
                                onClick={saveAndRedirectToExplorer}
                                disabled={scenario.trim() == "" || context.trim() == "" || subject.trim() == ""}>Save</button>
                        </div>
                    </div>
                }

            </div>
        );
    }


export let TestRecorder = createTestRecorder()
