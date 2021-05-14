export const stringCaseHelpers = {
    toString(s: any) { return s.toString() },
    sneakToCamelCase(str: string) {
        str = str.toString()
        return str.replace(/_./g, x => x[1].toUpperCase())
    },
    sneakToPascalCase(str: string) {
        str = str.toString()
        return str.replace(/(^|_)./g, str => str.toUpperCase())
            .replace(/_*/g, '')
    },
    sneakToKebabCase(str: string) {
        str = str.toString()
        return str.replace(/_/g, '-')
    },
    sneakToSpaceCase(str: string) {
        str = str.toString()
        return str.replace(/_/g, ' ')
    },
    sneakToSentenceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.capitalize(stringCaseHelpers.sneakToSpaceCase(str))
    },
    capitalize(str: string) {
        str = str.toString()
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
    toSnakeCase(str: string) {
        str = str.toString()
        return str.toString().trim()
            .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
            .replace(/-|\s/g, '')
            .replace(/_+/g, '_')
            .toLowerCase()
    },

    toCamelCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.sneakToCamelCase(stringCaseHelpers.toSnakeCase(str))
    },
    toPascalCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.sneakToPascalCase(stringCaseHelpers.toSnakeCase(str))
    },
    toKebabCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.sneakToKebabCase(stringCaseHelpers.toSnakeCase(str))
    },
    toSpaceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.sneakToSpaceCase(stringCaseHelpers.toSnakeCase(str))
    },
    toSentenceCase(str: string) {
        str = str.toString()
        return stringCaseHelpers.sneakToSentenceCase(stringCaseHelpers.toSnakeCase(str))
    },


}