export type prop = singularProperty | arrayProperty
export type property = {
    type: string,
    description: string,
}
export interface singularProperty {
    example: any
}
export interface arrayProperty extends property {
    type: "array"
    items: prop[]
}

export type properties = {
    [title: string]: prop
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