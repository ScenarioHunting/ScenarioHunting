export const stringHelpers = {
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
    json(obj: any): string {
        return JSON.stringify(obj)
    }
}