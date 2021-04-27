export const stringCaseHelpers = {
    sneakToCamelCase(str: string) {
        return str.replace(/_./g, x => x[1].toUpperCase())
    },
    sneakToPascalCase(str: string) {
        return str.replace(/(^|_)./g, str => str.toUpperCase())
            .replace(/_*/g, '')
    },
    sneakToKebabCase(str: string) {
        return str.replace(/_/g, '-')
    },
    sneakToSpaceCase(str: string) {
        return str.replace(/_/g, ' ')
    },
    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
    toSnakeCase(str: string) {
        return str.trim()
            .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')
            .replace(/-/g, '')
            .replace(/\s/g, '')
            .replace(/_+/g, '_')
            .toLowerCase()
    },
    toCamelCase(str: string) {
        return stringCaseHelpers.sneakToCamelCase(stringCaseHelpers.toSnakeCase(str))
    }
}