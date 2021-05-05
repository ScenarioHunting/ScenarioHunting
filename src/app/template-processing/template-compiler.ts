import { log } from "../../external-services";
// import Handlebars from "handlebars/dist/handlebars.js"
// import "handlebars/types/index"
import { stringCaseHelpers } from "../../libs/string-case-helpers";
import Handlebars from 'handlebars/dist/cjs/handlebars'

const helpers = {

    /**
     * Object to JSON
     * @param o Object to be converted to JSON.
     */
    json(o: any): string {
        return JSON.stringify(o, null, 4)
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

Object.entries(stringCaseHelpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))
Object.entries(helpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))

Handlebars.registerHelper('helperMissing', function ( /* dynamic arguments */) {
    var options = arguments[arguments.length - 1];
    // const userArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
    throw {
        lineNumber: options.loc.start.line,
        endLineNumber: options.loc.end.line,
        column: options.loc.start.column,
        endColumn: options.loc.end.column,
        name: "Error",
        message: options.name + " is not defined"
    }
})
Handlebars.registerHelper('blockHelperMissing', (context, options) => {
    throw {
        lineNumber: options.loc.start.line,
        endLineNumber: options.loc.end.line,
        column: options.loc.start.column,
        endColumn: options.loc.end.column,
        name: "Error",
        message: options.name + " is not defined in the block: " + options.fn(context)
    }
});

Handlebars.registerHelper("formIt", function (data, options) {
    var fields = {};
    //Generate the Inputs
    for (var k in data) {
        var v = data[k];
        fields[k] = new Handlebars.SafeString(v + ",");
    }

    return options.fn(fields);
});

export class TemplateCompiler {
    compileTemplate(template: string, testSchema): string {
        try {
            var compiledTemplate = Handlebars.compile(template);

            //TODO: validate: the test must have When and Then at least.
            return compiledTemplate(testSchema)
        } catch (err) {
            let wrappedError = {
                startLineNumber: err.lineNumber,
                endLineNumber: err.endLineNumber,
                startColumn: err.column,
                endColumn: err.endColumn,
                message: err.message
            }
            if (!wrappedError.startLineNumber) {
                const lineNumberMatch = String(err).match(/error on line (\d+)/)
                if (lineNumberMatch && lineNumberMatch.length > 1) {
                    wrappedError.startLineNumber = parseInt(lineNumberMatch[1])
                    wrappedError.endLineNumber = wrappedError.startLineNumber + 1
                }
            }
            throw wrappedError
        }
    }
}