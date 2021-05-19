import { properties, stepSchema, arrayProperty, singularProperty } from '../../app/spec';

const removeStartingDash = (str: string): string =>
    str[0] == '-' ? str.substring(1) : str;

function createSingularProperty(description: string, example: any): singularProperty {
    if (!isNaN(parseFloat(example))) {
        return {
            type: "number",
            description: description,
            example: parseFloat(example)
        } as singularProperty
    }
    if (["true", "false"].includes(example.toLowerCase())) {
        return {
            type: "boolean",
            description: description,
            example: example.toLowerCase() == "true"
        } as singularProperty
    }
    
    return {
        type: "string",
        description: description,
        example: example
    } as singularProperty
}
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
    //
    let isInArrayScope = false //Pass it as a recursive parameter
    let parentArrayPropertyName = ""//Pass it as a recursive parameter
    //^Refactor to a stack

    rows.map(row => row.split(":")).forEach(kv => {

        const purePropertyName = removeStartingDash(kv[0].trim())
        if (purePropertyName == '')
            return

        // const propertyName = toSnakeCase(purePropertyName)

        let propertyValue = kv[1]
        if (!propertyValue) {
            propertyValue = purePropertyName
        }
        propertyValue = propertyValue.trim()

        let propertyName = purePropertyName.trim()

        if (isInArrayScope) {
            if (propertyValue.endsWith(']')) {
                propertyValue = propertyValue.slice(0, -1)
                isInArrayScope = false
                propertyName = propertyName.slice(0, -1)
            }
            (<arrayProperty>props[parentArrayPropertyName]).items.push(
                createSingularProperty(propertyName, propertyValue))

            return
        }

        if (propertyValue[0] == '[') {
            isInArrayScope = true
            const property: arrayProperty = {
                type: "array",
                description: propertyName,
                items: []
            }
            const firstItemsPropertyName = propertyValue.substring(1)

            if (firstItemsPropertyName) {
                property.items.push(
                    createSingularProperty(firstItemsPropertyName, firstItemsPropertyName))
            }
            props[propertyName] = property
            parentArrayPropertyName = propertyName
            return
        }


        props[propertyName] = createSingularProperty(propertyName, propertyValue)
    })
    return Promise.resolve({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: 'object',
        title: title,
        properties: props,
    })
}