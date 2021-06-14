//    const toString=(s: any):string => s.toString() 

const snakeToCamelCase = (str: string): string =>
    str.toString().replace(/_./g, x => x[1].toUpperCase());

const snakeToPascalCase = (str: string): string =>
    str.toString().replace(/(^|_)./g, str => str.toUpperCase())
        .replace(/_*/g, '')

const snakeToKebabCase = (str: string): string =>
    str.toString().replace(/_/g, '-')

const snakeToSpaceCase = (str: string): string =>
    str.toString().replace(/_/g, ' ')

const snakeToSentenceCase = (str: string): string =>
    stringCaseHelpers.capitalize(snakeToSpaceCase(str.toString()))
const pascalToSpaceCase = (str: string) =>
    str
        // Look for long acronyms and filter out the last letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
        // Look for lower-case letters followed by upper-case letters
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        // Look for lower-case letters followed by numbers
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/^./, function (str) { return str.toUpperCase(); })
        .trim()

export const stringCaseHelpers = {
    lowerCase(str: string) { return str.toString().toLocaleLowerCase() },
    upperCase(str: string) { return str.toString().toLocaleUpperCase() },

    capitalize(str: string) {
        str = str.toString()
        return str.charAt(0).toUpperCase() + str.slice(1)
    },

    snakeCase(str: string) {
        return pascalToSpaceCase(str.toString())
            .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
            .replace(/-|\s/g, '')
            .replace(/_+/g, '_')
            .toLowerCase()
    },

    camelCase(str: string) {
        return snakeToCamelCase(stringCaseHelpers.snakeCase(str.toString()))
    },
    pascalCase(str: string) {
        return snakeToPascalCase(stringCaseHelpers.snakeCase(str.toString()))
    },
    kebabCase(str: string) {
        return snakeToKebabCase(stringCaseHelpers.snakeCase(str.toString()))
    },
    spaceCase(str: string) {
        return snakeToSpaceCase(stringCaseHelpers.snakeCase(str.toString()))
    },
    sentenceCase(str: string) {
        return snakeToSentenceCase(stringCaseHelpers.snakeCase(str.toString()))
    },
    toCamelCase(str: string) { return stringCaseHelpers.camelCase(str) },
    toSentenceCase(str: string) { return stringCaseHelpers.sentenceCase(str) },
    toPascalCase(str: string) { return stringCaseHelpers.pascalCase(str) }

}