import { stringify } from 'yaml'

export const helpers = {
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
    repeat(text:string) {
        return text.repeat(arguments[1])
    }
}