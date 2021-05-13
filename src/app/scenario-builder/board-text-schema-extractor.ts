import { properties, stepSchema, arrayProperty, singularProperty } from '../../app/spec';

const toSnakeCase = (str: string) => str.trim()
    .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/_+/g, '_')
    .toLowerCase()


const removeStartingDash = (str: string): string =>
    str[0] == '-' ? str.substring(1) : str;

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
    //^They should be a stack
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

        const propertyName = purePropertyName.trim()

        if (isInArrayScope) {
            if (propertyValue.endsWith(']')) {//what if the '[' never closes => it wasn't an array.
                propertyValue = propertyValue.slice(0, -1)
                isInArrayScope = false
            }
            (<arrayProperty>props[parentArrayPropertyName]).items.concat([<singularProperty>{//It may not be singular
                type: "object",
                description: propertyName,
                example: propertyValue.trim()
            }])

            return
        }
        if (propertyValue[0] == '[') {
            isInArrayScope = true
            const property: arrayProperty = {
                type: "array",
                description: propertyName.substring(1),
                items: []
            }
            props[propertyName] = property
            parentArrayPropertyName = propertyName
            return
        }
        // if(isInArrayScope){

        // }
        console.log("dddddddd", propertyValue)
        const property: singularProperty = {
            type: "object",
            description: propertyName,
            example: propertyValue.trim()
        }
        props[propertyName] = property
    })

    return Promise.resolve({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: 'object',
        title: title,
        properties: props,
    })
}

// export async function extractStepSchema({
//     abstractionWidgetText
//     , exampleWidgetText
// }: { abstractionWidgetText: string, exampleWidgetText: string }): Promise<stepSchema> {

//     let title = abstractionWidgetText.trim().split('\n').shift()
//     if (!title) {
//         return Promise.reject("Unknown text format.")
//     }

//     const rows = exampleWidgetText.split(/\n|;|,|\//)
//     if (rows[0] == title) {
//         rows.shift()
//     }

//     // title = toSnakeCase(title!).trim()

//     var props: properties = {}
//     rows.map(row => row.split(":")).forEach(kv => {

//         const purePropertyName = removeStartingDash(kv[0].trim())
//         if (purePropertyName == '')
//             return

//         // const propertyName = toSnakeCase(purePropertyName)

//         let propertyValue = kv[1]
//         if (!propertyValue) {
//             propertyValue = purePropertyName
//         }

//         let type = 'string'

//         if (propertyValue[0] == '[' && propertyValue.endsWith(']')) {
//             type = 'array'
//         }
//         console.log("dddddddd",propertyValue)

//         const propertyName = purePropertyName.trim()
//         props[propertyName] = {
//             type: type,
//             description: propertyName,
//             example: propertyValue.trim()
//         }
//     })

//     return Promise.resolve({
//         $schema: "http://json-schema.org/draft-07/schema#",
//         type: 'object',
//         title: title,
//         properties: props,
//     })
// }

const toCamelCase = (str: string) =>
    str.trim()//.toLowerCase()
        .replace(/([^A-Z0-9]+)(.)/ig,
            function () {
                return arguments[2].toUpperCase();
            }
        )