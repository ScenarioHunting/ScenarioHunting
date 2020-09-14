import * as React from 'react';
import { globalStepNavigator, Givens, IndexedStep } from './given';
import { WhenStep as When } from './when';
import { ThenStep as Then } from './then';
import { Step } from "./step";
import { navigate } from "@reach/router"
import { globalBoard } from '../global';
import { Widget } from 'board';

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
export function TestRecorder(props) {

    React.useEffect(() => {
        globalBoard.unselectAll()
            .then(globalStepNavigator.start);
    }, []);


    React.useEffect(() =>
        recordTestName(testName == "" ?
            when?.data.type + '_' + then?.data.type
            : testName))

    async function getBoardTitle() {
        let boardInfo = await miro.board.info.get();
        // this.setState({ boardTitle: boardInfo.title });
    }

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
    const updateThen = (when: Step) => {
        recordThen(when);
    };
    const showValidationError = (errorText: string) => {
        globalBoard.showNotification(errorText)
    }
    const toDto = (given: IndexedStep[], when: Step, then: Step): NewTestDto => {

        return {
            context: testContext,
            testName: testName,
            test: {
                givens: given.map(indexedStep => {
                    return {
                        step: {
                            type: indexedStep.step.data.type,
                            properties: indexedStep.step.data.properties.map(p => p as StepDataPropertyDto)
                        } as StepDataDto,
                        index: indexedStep.index
                    } as IndexedStepDataDto
                }),
                when: when.data as StepDataDto,
                thens: [{ step: then.data as StepDataDto, index: 0 } as IndexedStepDataDto],
                sut: sutName,
            },
            metadata: {
                contents: JSON.stringify({
                    given: given.map(is => { step: is.step.metadata, is.index }),
                    when: when.metadata,
                    then: [{ step: then.metadata, index: 0 }]
                })
            }
        }
    }
    const save = async () => {
        if (!when) {
            showValidationError('No when selections. Please save the test after selecting the when step.')
            return
        }
        if (!then) {
            showValidationError('No then selections. Please save the test after selecting the then step.')
            return
        }

        const dto = toDto(givens, when, then)

        var requestBody = JSON.stringify(dto);
        console.log(requestBody);
        const response = await fetch('https://localhost:6001/Tests',
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: requestBody
            });
        if (response.ok)
            globalBoard.showNotification('Test created successfully.');
        const toViewModel = (step: Step): StepInfo => {
            return {
                type: step.data.type,
                widget: step.metadata.widget
            }
        }
        var viewModel: ViewModel = {
            testContext,
            sutName,
            testName,
            givens: givens.map(step => toViewModel(step.step))
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

                    <button className='save-button' onClick={save}>Save</button>

                    <label className="test-name-label">Test Name:</label>
                    <input type='text' className="test-name-input" value={testName} onChange={x => recordTestName(x.target.value)} placeholder="Test Name" />
                </div>
            }

        </div>
    );
}



//----------------------

type NewTestDto = {
    context: string
    testName: string
    test: TestDto
    metadata: TestMetadataDto
}
type StepDataPropertyDto = {
    propertyName: string
    simplePropertyValue: string
}

type StepDataDto = {
    type: string
    properties: StepDataPropertyDto[]
}

type IndexedStepDataDto = {
    step: StepDataDto
    index: number
}

type TestDto = {
    sut: string

    givens: IndexedStepDataDto[]
    when: StepDataDto
    thens: IndexedStepDataDto[]
}

type TestMetadataDto = {
    contents: string
}
