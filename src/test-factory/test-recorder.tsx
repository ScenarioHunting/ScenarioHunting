import {  singletonBoard } from '../global-dependency-container';
import * as React from 'react';
import { Givens, IndexedStep } from './given-collection';
import { WhenStep as When } from './when-step';
import { ThenStep as Then } from './then-step';
import { Step } from "./board-data-mapper";
import { navigate } from "@reach/router"
import { Widget } from 'board';
import { Save, LocalTestCreationResult } from './test-recorder-http-service';
import { singletonStepNavigator } from './local-dependency-container';

export type StepInfo = {
    type: string
    widget: Widget
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
        React.useEffect(() => {
            board.unselectAll()
                .then(stepNavigator.start);
        }, [board]);


        // React.useEffect(() =>
        //     recordTestName(testName == "" ?
        //         when?.data.type + '_' + then?.data.type
        //         : testName))


        const [givens, recordGiven] = React.useState<IndexedStep[]>([]);
        const [when, recordWhen] = React.useState<Step>();
        const [then, recordThen] = React.useState<Step>();
        const [testName, recordTestName] = React.useState<string>("");
        const [testContext, recordTestContext] = React.useState<string>("SampleService");
        const [sutName, recordSutName] = React.useState<string>("");

        const updateGivens = (givenResults: IndexedStep[]) => {
            recordGiven(givenResults);
        };
        const updateWhen = (when: Step) => {
            recordWhen(when);
        };
        const updateThen = (then: Step) => {
            recordThen(then);
        };
        const showValidationError = (errorText: string) => {
            board.showNotification(errorText)
        }

        const saveAndRedirectToExplorer = async () => {
            if (!when) {
                showValidationError('No when selections. Please save the test after selecting the when step.')
                return
            }
            if (!then) {
                showValidationError('No then selections. Please save the test after selecting the then step.')
                return
            }

            save({
                testContext,
                testName,
                sutName,

                givens,
                when,
                then
            } as LocalTestCreationResult
                , () => board.showNotification('Test created successfully.')
                , (statusText: string) => board.showNotification('Test creation error try again later.\n' + statusText)//TODO: provide more guidance to user
            );

            const toViewModel = (step: Step): StepInfo => {
                return {
                    type: step.data.type,
                    widget: step.metadata.widget
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
            // console.log(response);
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
                    </div>
                }

            </div>
        );
    }


export let TestRecorder = createTestRecorder()