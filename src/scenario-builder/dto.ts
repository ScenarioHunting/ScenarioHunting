export type CreateTestDto = {
    context: string
    testName: string
    test: TestDto
    metadata: TestMetadataDto
}
type StepDataPropertyDto = {
    propertyName: string
    simplePropertyValue: string
}

export type StepDataDto = {
    type: string
    properties: StepDataPropertyDto[]
}

export type IndexedStepDataDto = {
    step: StepDataDto
    index: number
}

export type TestDto = {
    sut: string

    givens: IndexedStepDataDto[]
    when: StepDataDto
    thens: IndexedStepDataDto[]
}

export type TestMetadataDto = {
    contents: string
}
