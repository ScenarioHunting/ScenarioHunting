import Handlebars from "handlebars/dist/handlebars.js"
import { stringCaseHelpers } from "../../libs/string-case-helpers";
const helpers = {
    
    /**
     * Object to JSON
     * @param o Object to be converted to JSON.
     */
    json(o: any): string {
        return JSON.stringify(o)
    },
    /**
     * Run the content every time but in the last iteration.
     */
    skipLast(options) {
        return options.data.last
        ? options.inverse()
        : options.fn()
    }
}

// Handlebars.registerHelper('skipLast', (options) =>
//     options.data.last
//         ? options.inverse()
//         : options.fn()
// )

Object.entries(stringCaseHelpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))
Object.entries(helpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))




export function compileTemplate(template: string, testSchema): string {




    var compiledTemplate = Handlebars.compile(template);

    //TODO: validate: the test must have When and Then at least.
    return compiledTemplate(testSchema)
}
