import { StepDataDto } from './dto';
type StepDataProperty = {
    propertyName: string
    simplePropertyValue: string
}
export async function convertWidgetToStepData(
    abstractionWidgetText: string
    , exampleWidgetText: string
    // // eslint-disable-next-line no-unused-vars
    // , succeed: (data: StepData) => void
    // eslint-disable-next-line no-unused-vars
): Promise<StepDataDto> {

    let type = abstractionWidgetText.split('\n').shift()
    if (!type) {
        return Promise.reject("Unknown text format.")
    }
    const rows = exampleWidgetText.split('\n')
    if (rows[0] == type) {
        rows.shift()
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
    const example: StepDataProperty[] = rows
        .map(p => p.split(":"))
        .map(convert);
    // const example = Object.fromEntries(value)
    // succeed({ type, properties: example })
    return Promise.resolve({ type, properties: example })
}