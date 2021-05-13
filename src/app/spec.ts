
export type property = {
    type: string,
    description: string,
}
export interface singularProperty extends property {
    type: "object",
    example: any
}
export interface arrayProperty extends property {
    type: "array"
    items: property[]
}
export type properties = {
    [title: string]: any//singularProperty | arrayProperty
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