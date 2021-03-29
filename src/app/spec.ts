export type properties = {
    [title: string]: {
        type: string,
        description: string,
        example: any
    }
}
export type stepSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: string,
    type: string,
    properties: properties
}
export type spec = {
    scenario: string,
    context: string,
    sut: string,
    givens: stepSchema[],
    when: stepSchema,
    thens: stepSchema[],
}