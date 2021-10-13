import { stringCaseHelpers } from '../../libs/string-case-helpers'
import { stringify } from 'yaml'

const helpers = {
    json(o: any): string {
        return JSON.stringify(o, null, 4)
    },
    yaml(o: any): string {
        return stringify(o, { indent: 4 })
    },
    concat() {
        var outStr = ''
        for (var arg in arguments)
            if (typeof arguments[arg] != 'object')
                outStr += arguments[arg]

        return outStr
    },
    subtract() {
        return (arguments[0] - arguments[1]).toString()
    },
    repeat(text: string) {
        return text.repeat(arguments[1])
    }
}
export const customHelpers = Object.entries(stringCaseHelpers)
    .map((h: [string, ((str: string) => string)]) => [h[0], (x: string) => h[1](!x ? '' : x)])
    .concat(Object.entries(helpers))