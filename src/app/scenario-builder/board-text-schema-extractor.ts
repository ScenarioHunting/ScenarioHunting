import { log } from '../../external-services';
import { Properties, ArrayProperty, SingularProperty, Prop, Schema } from '../api';

const removeStartingDash = (str: string): string =>
    str[0] == '-' ? str.substring(1) : str;

function createSingularProperty(description: string, example: any): SingularProperty {
    if (!isNaN(parseFloat(example))) {
        return {
            type: "number",
            description: description,
            example: parseFloat(example)
        } as SingularProperty
    }
    if (["true", "false"].includes(example.toLowerCase())) {
        return {
            type: "boolean",
            description: description,
            example: example.toLowerCase() == "true"
        } as SingularProperty
    }

    return {
        type: "string",
        description: description,
        example: example
    } as SingularProperty
}
// function areAllItemsTheSame(array: any[]) {
//     return new Set(array).size == 1
// }
export async function extractStepFromText({
    schemaText
    , dataText
}: { schemaText: string, dataText: string }): Promise<{ schema: Schema; data: any }> {

    let title = schemaText.trim().split('\n').shift()
    if (!title) {
        return Promise.reject("Unknown text format.")
    }
    let result = {
        schema: {
            type: 'object',
            title: title,
            properties: <Properties>{}
        },
        data: {}
    }
    const rows = dataText.trim().split(/\n|;|,|\//)
    if (rows[0] == title) {
        rows.shift()
    }

    // title = snakeCase(title!).trim()

    // var props: Properties = {}
    //
    let isInArrayScope = false //Pass it as a recursive parameter
    let parentArrayPropertyName = ""//Pass it as a recursive parameter
    //^Refactor to a stack

    rows.map(row => row.split(":")).forEach(kv => {

        const purePropertyName = removeStartingDash(kv[0].trim())
        if (purePropertyName == '')
            return

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
            result.data[propertyName] = propertyValue;
            log.log("The property: " + propertyName + " set to: " + propertyValue + "=> result:" + result.data[propertyName])
            if (Array.isArray((<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items)) {
                (<Prop[]>(<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items).push(
                    createSingularProperty(propertyName, propertyValue))
            }
            else {
                (<Prop>(<ArrayProperty>result.schema.properties[parentArrayPropertyName]).items)
                    = createSingularProperty(propertyName, propertyValue)
            }
            return
        }

        if (propertyValue[0] == '[') {
            isInArrayScope = true
            const property: ArrayProperty = {
                type: "array",
                description: propertyName,
                items: []
            }
            const firstItemsPropertyName = propertyValue.substring(1)

            //TODO: support value objects as arrays:
            // if (firstItemsPropertyName) {
            //     (property.items as Prop[]).push(
            //         createSingularProperty(firstItemsPropertyName, firstItemsPropertyName))
            // }

            // if (areAllItemsTheSame(property.items as Prop[]))
            property.items = createSingularProperty(firstItemsPropertyName, firstItemsPropertyName)

            result.schema.properties[propertyName] = property
            parentArrayPropertyName = propertyName
            return
        }


        result.schema.properties[propertyName] = createSingularProperty(propertyName, propertyValue)
    })
    return Promise.resolve(result)
}