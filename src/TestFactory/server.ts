import { IndexedStep } from "./given"
import { Step } from "./step"
import { CreateTestDto, StepDataDto, IndexedStepDataDto, StepDataPropertyDto } from "./dto"

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
                given: givens.map(given => { given.step.metadata, given.index }),
                when: when.metadata,
                then: [{ step: then.metadata, index: 0 }]
            })
        }
    }
}

export type LocalTestCreationResult = {
    testContext: string
    , testName: string
    , sutName: string

    , givens: IndexedStep[]
    , when: Step
    , then: Step
}

export async function Save(test: LocalTestCreationResult,onSuccess,onError) {
    const dto = toDto(test)

    var requestBody = JSON.stringify(dto);
    console.log(requestBody);
    const response = await fetch('https://localhost:6001/Tests',
        {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: requestBody
        });
    if (response.ok)
        onSuccess()
    else
        onError()
        


}