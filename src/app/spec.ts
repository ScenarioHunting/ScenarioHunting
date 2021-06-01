export type Prop = SingularProperty | ArrayProperty
export type Property = {
    type: string,
    description: string,
}
export interface SingularProperty extends Property {
    example: any
}
export interface ArrayProperty extends Property {
    type: "array"
    items: Prop[]
}

export type Properties = {
    [title: string]: Prop
}
export type StepSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: string,
    type: string,
    properties: Properties
}
export type Spec = {
    scenario: string,
    context: string,
    subject: string,
    given: StepSchema[],
    when: StepSchema,
    then: StepSchema[],
}