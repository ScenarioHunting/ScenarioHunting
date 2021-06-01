export const stringCaseHelpers = {
    toString(s: any) { return s.toString() },
    toLowerCase(str: string) { return str.toLocaleLowerCase() },
    snakeToCamelCase(str: string) {
        str = str.toString()
        return str.replace(/_./g, x => x[1].toUpperCase())
    },
    snakeToPascalCase(str: string) {
        str = str.toString()
        return str.replace(/(^|_)./g, str => str.toUpperCase())
            .replace(/_*/g, '')
    },
    snakeToKebabCase(str: string) {
        str = str.toString()
        return str.replace(/_/g, '-')
    },
    snakeToSpaceCase(str: string) {
        str = str.toString()
        return str.replace(/_/g, ' ')
    },
    snakeToSentenceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.capitalize(stringCaseHelpers.snakeToSpaceCase(str))
    },
    capitalize(str: string) {
        str = str.toString()
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
    pascalToSpaceCase(str: string) {
        return str
            // Look for long acronyms and filter out the last letter
            .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
            // Look for lower-case letters followed by upper-case letters
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            // Look for lower-case letters followed by numbers
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); })
            .trim()
    },
    toSnakeCase(str: string) {
        return stringCaseHelpers.pascalToSpaceCase(str.toString())
            .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
            .replace(/-|\s/g, '')
            .replace(/_+/g, '_')
            .toLowerCase()
    },

    toCamelCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.snakeToCamelCase(stringCaseHelpers.toSnakeCase(str))
    },
    toPascalCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.snakeToPascalCase(stringCaseHelpers.toSnakeCase(str))
    },
    toKebabCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.snakeToKebabCase(stringCaseHelpers.toSnakeCase(str))
    },
    toSpaceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.snakeToSpaceCase(stringCaseHelpers.toSnakeCase(str))
    },
    toSentenceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.snakeToSentenceCase(stringCaseHelpers.toSnakeCase(str))
    },


}