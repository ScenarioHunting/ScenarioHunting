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
        const [contextErrors, setContextErrors] = useState<string>("")
        const [subjectErrors, setSubjectErrors] = useState<string>("")

        function changeContext(context: string) {
            if (context == "")
                setContextErrors("Context is required!")
            else if (context.length > 50)
                setContextErrors("Too long")
            else
                setContextErrors("")
            recordContext(context)
        }
        React.useCallback(() => {
            if (subject == "") {
                setSubjectErrors("Subject under test is required!")
            }
        }, [subject])
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
        const showValidationError = (errorText: string) => {
            board.showNotification(errorText)
        }

        const saveAndRedirectToExplorer = async () => {
            console.log('saving...')
            if (!when) {
                showValidationError('No when selections. Please save the test after selecting the when step.')
                return
            }
            if (!then) {
                showValidationError('No then selections. Please save the test after selecting the then step.')
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

        function getClassNamesForRequiredValue(value: string) {
            const classNames = "miro-input miro-input--small miro-input--primary"
            const invalidClassName = "miro-input-field--invalid"
            if (value.trim() == "")
                return " " + classNames + " " + invalidClassName
            return " " + classNames + " miro-input--success"
        }
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
                        <label className="test-context-label">Context:</label>
                        <div className={"test-context-input miro-input-field miro-input-field--small" + contextErrors == "" ? "miro-input-field--success" : "miro-input-field--invalid"}>
                            <input type='text'
                                className={"test-context-input miro-input miro-input--primary"}
                                value={context} onChange={x => changeContext(x.target.value)}
                                placeholder="Context"
                            />
                            <div className="status-text">{contextErrors}</div>
                            {/* {context == "" && <div className="status-text">Context is required</div>} */}
                        </div>

                        <label className="sut-label">Subject:</label>

                        <div className="sut-input">
                            <input type='text'
                                className={"sut-input" + getClassNamesForRequiredValue(subject)}
                                value={subject}
                                onChange={x => recordSubject(x.target.value)}
                                placeholder="Subject Under Test" />
                            <div className="status-text">{subjectErrors}</div>

                            {/* {subject == "" && <div className="status-text">Subject is required</div>} */}
                        </div>

                        <label className="test-name-label">Scenario:</label>
                        <div className="test-name-input">

                            <input type='text'
                                className={"test-name-input" + getClassNamesForRequiredValue(scenario)}
                                value={scenario} onChange={x => recordScenario(x.target.value)}
                                placeholder="Scenario" />
                            {/* {scenario == "" && <div className="status-text">Scenario is required</div>} */}
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
