import Handlebars from "handlebars/dist/handlebars.js"
import { stringCaseHelpers } from "../../libs/string-case-helpers";
const helpers = {

    /**
     * Object to JSON
     * @param o Object to be converted to JSON.
     */
    json(o: any): string {
        return JSON.stringify(o,null,4)
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



export class TemplateCompiler {
    compileTemplate(template: string, testSchema): string {
        try {
            var compiledTemplate = Handlebars.compile(template);

            //TODO: validate: the test must have When and Then at least.
            return compiledTemplate(testSchema)
        } catch (err) {
            let wrappedError = {
                hasLineNumber: false,
                lineNumber: 0,
                internalError: err
            }
            const lineNumberMatch = String(err).match(/error on line (\d+)/)
            if (lineNumberMatch && lineNumberMatch.length > 1) {
                wrappedError.lineNumber = parseInt(lineNumberMatch[1])
                wrappedError.hasLineNumber = true
            }
            throw wrappedError
        }
    }
}