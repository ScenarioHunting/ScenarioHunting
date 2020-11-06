import { IndexedStep } from "./given-collection"
import { CreateTestDto, IndexedStepDataDto } from "./dto"
import { SelectedWidget } from "board"

const toDto = ({ testContext
    , testName
    , sutName

    , givens
    , when
    , then }: LocalTestCreationResult): CreateTestDto => {

    return {
        context: testContext,
        testName: testName,
        test: {
            givens: givens.map(indexedStep => {
                return {
                    step: indexedStep.step.widgetData,
                    // step: {
                    //     type: indexedStep.step.data.type,
                    //     properties: indexedStep.step.data.properties.map(p => p as StepDataPropertyDto)
                    // },
                    index: indexedStep.index
                } as IndexedStepDataDto
            }),
            when: when.widgetData,
            thens: [{ step: then.widgetData, index: 0 } as IndexedStepDataDto],
            sut: sutName,
        },
        metadata: {
            contents: JSON.stringify({
                given: givens.map(given => { given.step.widgetSnapshot, given.index }),
                when: when.widgetSnapshot,
                then: [{ step: then.widgetSnapshot, index: 0 }]
            })
        }
    }
}

export type LocalTestCreationResult = {
    testContext: string
    , testName: string
    , sutName: string

    , givens: IndexedStep[]
    , when: SelectedWidget
    , then: SelectedWidget
}

export async function Save(test: LocalTestCreationResult, onSuccess, onError) {
    try {
        const dto = toDto(test)

        var requestBody = JSON.stringify(dto);
        console.log(requestBody);
        const response = await fetch('https://localhost:6001/Tests',//TODO: read it from config file
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: requestBody
            });
        if (response.ok)
            onSuccess()
        else
            onError(response.statusText)
    }
    catch (error) {
        onError(error)
    }

}