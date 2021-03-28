import { properties, stepSchema } from 'app/spec';
const toCamelCase = (str: string) =>
    str.trim()//.toLowerCase()
        .replace(/([^A-Z0-9]+)(.)/ig,
            function () {
                return arguments[2].toUpperCase();
            }
        )

export async function extractStepSchema(
    abstractionWidgetText: string
    , exampleWidgetText: string
): Promise<stepSchema> {

    let type = abstractionWidgetText.split('\n').shift()
    if (!type) {
        return Promise.reject("Unknown text format.")
    }
    const rows = exampleWidgetText.split('\n')
    if (rows[0] == type) {
        rows.shift()
    }

    type = toCamelCase(type!)

    var props: properties = {}
    rows.map(p => p.split(":")).forEach(p => {
        const propertyName = toCamelCase(p[0])
        props[propertyName] = {
            type: "string",
            description: propertyName,
            example: p[1].trim()
        }
    })

    return Promise.resolve({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: 'object',
        title: type,
        properties: props,
    })
}