import { Widget } from 'board';

export type Step = {
    metadata: StepMetadata
    data: StepData
}

type StepMetadata = {
    stepType: string
    widget: Widget
}
type StepData = {
    type: string
    properties: StepDataProperty[]
}
type StepDataProperty = {
    propertyName: string
    simplePropertyValue: string
}
export function convertWidgetToStepData(widget: Widget
    // eslint-disable-next-line no-unused-vars
    , succeed: (data: StepData) => void
    // eslint-disable-next-line no-unused-vars
    , fail: (error: string) => void) {

    const chunks = widget.text.split('\n')
    let type = chunks.shift()
    if (!type) {
        fail("Unknown text format.")
    }
    // const value = chunks
    const toCamelCase = (str: string) =>
        str.trim()//.toLowerCase()
            .replace(/([^A-Z0-9]+)(.)/ig,
                function () {
                    return arguments[2].toUpperCase();
                }
            )
    type = toCamelCase(type!)
    const convert = (p: string[]): StepDataProperty => {
        return { propertyName: toCamelCase(p[0]), simplePropertyValue: p[1].trim() }
    }
    const example: StepDataProperty[] = chunks
        .map(p => p.split(":"))
        .map(convert);
    // const example = Object.fromEntries(value)
    succeed({ type, properties: example })
}