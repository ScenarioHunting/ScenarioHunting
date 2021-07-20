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
export type Schema = //SingularProperty & //Deferred this decision because it's not necessary now
{
    title: string,
    type: string,
    // description: string,
    properties: Properties
}
export type Step = {
    data: Schema
}
export type Steps = Step[]
export type Spec = {
    scenario: string,
    context: string,
    subject: string,
    given: Steps,
    when: Step,
    then: Steps,
}