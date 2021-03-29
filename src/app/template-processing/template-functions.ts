export const templateFunctions = {
    camelCase(str: string) {
        return str.replace(/_./g, x => x[1].toUpperCase())
    },
    pascalCase(str: string) {
        return str.replace(/(^|_)./g, str => str.toUpperCase())
            .replace(/_*/g, '')
    },
    kebabCase(str: string) {
        return str.replace(/_/g, '-')
    },
    spaceCase(str: string) {
        return str.replace(/_/g, ' ')
    },
    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}