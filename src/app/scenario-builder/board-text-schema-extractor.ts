import { properties, stepSchema } from '../../app/spec';

const toSnakeCase = (str: string) => str.trim()
    .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/_+/g, '_')
    .toLowerCase()


const removeStartingDash = (str: string): string =>
    str[0] == '-' ? str.substring(1) : str

export async function extractStepSchema({
    abstractionWidgetText
    , exampleWidgetText
}: { abstractionWidgetText: string, exampleWidgetText: string }): Promise<stepSchema> {

    let title = abstractionWidgetText.trim().split('\n').shift()
    if (!title) {
        return Promise.reject("Unknown text format.")
    }

    const rows = exampleWidgetText.split(/\n|;|,|\//)
    if (rows[0] == title) {
        rows.shift()
    }

    // title = toSnakeCase(title!).trim()

    var props: properties = {}
    rows.map(row => row.split(":")).forEach(kv => {

        const purePropertyName = removeStartingDash(kv[0].trim())
        if (purePropertyName == '')
            return

        const propertyName = purePropertyName
        // const propertyName = toSnakeCase(purePropertyName)

        let propertyValue = kv[1]
        if (!propertyValue) {
            propertyValue = purePropertyName
        }

        props[propertyName] = {
            type: "string",
            description: propertyName,
            example: propertyValue.trim()
        }
    })

    return Promise.resolve({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: 'object',
        title: title,
        properties: props,
    })
}

const toCamelCase = (str: string) =>
    str.trim()//.toLowerCase()
        .replace(/([^A-Z0-9]+)(.)/ig,
            function () {
                return arguments[2].toUpperCase();
            }
        )