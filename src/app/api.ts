// npx typedoc src/app/api.ts --theme minimal --highlightTheme dark-plus --sort static-first --hideGenerator
export type Api = {
    scenario: Scenario
    /**
     * Information required by the given step of the test
     */
    given: Step[]
    /**
     * Information required by the when step of the test
     */
    when: Step
    /**
     * Information required by the then step of the test
     */
    then: Step[]
    /**
     * Context in which the scenario makes sense
     */
    context: Context
    /**
     * Subject or the system under test
     */
    subject: Subject

    /**
     * Test parameters (for parameterized testing)
     * Each sub-scenario has a different set of parameter value
     * Parameters can be referenced by their address.
     * Parameters are referenced like: ./parameters/{subScenario}/parameterName
     * example: 
     *      ref: ./parameters/{subScenario}/FirstName
     *      parameter: FirstName
     * 
     */
    parameters?: {
        [subScenario: string]: {
            [parameterName: string]: AbstractProperty
        }
    }
}
/**Information about the scenario */
export type Scenario = {
    title: string
}
/**
 * A scenario step
 */
export type Step = {
    title: string
    schema: ObjectProperty
    example: object
    examples?: ExamplesOf<object>
    // reference
}
/** Context of the scenario */
export type Context = {
    title: string
}
/** The system under test */
export type Subject = {
    title: string
}

type Property<TExample extends SingularType | SingularType[]> = {
    type: string
    description?: string
    example?: TExample
    examples?: ExamplesOf<TExample>
}

export interface IntegerProperty extends Property<number> {
    type: "integer"
}
export interface NumberProperty extends Property<number> {
    type: "number"
}
export interface BooleanProperty extends Property<boolean> {
    type: "boolean"
}
export interface StringProperty extends Property<string> {
    type: "string"
}
export interface NullProperty extends Property<null> {
    type: "null"
    example: null
}
export interface ArrayProperty extends Property<SingularType[]> {
    type: "array"
    items: AbstractProperty | AbstractProperty[]// Depending on whether all items are of the same type or not.

}

export type Properties = {
    [title: string]: AbstractProperty
}
export interface ObjectProperty extends Property<object> {
    type: "object",
    properties: Properties
}

/** @internal */
type SingularType =
    string
    | boolean
    | number
    //|integer
    | null
    | object

/** @internal */
export type SingularProperty = Property<SingularType>

/** @internal */
export type AbstractProperty = SingularProperty | ArrayProperty

type ExamplesOf<T extends SingularType> = {
    [subScenario: string]: T
}



//Human readable api:
// Removes items from basket:
// given:
//     - Items added to Basket:
//           Customer id: Customer id
//           product id: product id
//           amount: "20"
// when:
//     Remove Items From Basket:
//         Customer id: Customer id
//         product id: product id
//         amount: "12"
// then:
//     - Items Removed From Basket:
//           Customer id: Customer id
//           product id: product id
//           amount: "12"
// subject: Basket
// context: Sales











