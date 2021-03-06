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
        const [testName, recordTestName] = useState<string>("");
        const [testContext, recordTestContext] = useState<string>("ServiceName");
        const [sutName, recordSutName] = useState<string>("SutName");
        const [selectedTemplateName, selectTemplateName] = useState<string>("no template");
        const [availableTemplateNames, setAvailableTemplateNames] = useState<string[]>([]);

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


        useEffect(() => {
            if (testName == "") {
                var defaultTestName = when?.widgetData.type + '_' + then?.widgetData.type
                recordTestName(defaultTestName)
            }
        }, [then])
        const updateGivens = (givenResults: IndexedStep[]) => {
            recordGiven(givenResults);
        };
        const updateWhen = (when: SelectedWidget) => {
            recordWhen(when);
        };
        const updateThen = (then: SelectedWidget) => {
            recordThen(then);
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
                    testContext,
                    testName,
                    sutName,

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
                testContext
                , sutName
                , testName
                , givens: givens.map(step => toViewModel(step.step))
                , when: toViewModel(when)
                , then: toViewModel(then)
            }

            await navigate('/test-explorer', { state: { newTest: viewModel } })
        };
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
                        <label className="test-context-label">Test Context:</label>
                        <input type='text' className="test-context-input" value={testContext} onChange={x => recordTestContext(x.target.value)} placeholder="Test Context" />

                        <label className="sut-label">SUT:</label>
                        <input type='text' className="sut-input" value={sutName} onChange={x => recordSutName(x.target.value)} placeholder="Sut Name" />

                        <button className='save-button' onClick={saveAndRedirectToExplorer}>Save</button>

                        <label className="test-name-label">Test Name:</label>
                        <input type='text' className="test-name-input" value={testName} onChange={x => recordTestName(x.target.value)} placeholder="Test Name" />

                        <label className="template-selector-label">Template:</label>
                        <select className="template-selector" value={selectedTemplateName}
                            onChange={(e) => selectTemplateName(e.target.value)}>
                            {availableTemplateNames.map((templateName) => (
                                <option key={templateName} value={templateName}>
                                    {templateName}
                                </option>
                            ))}
                        </select>

                    </div>
                }

            </div>
        );
    }


export let TestRecorder = createTestRecorder()
