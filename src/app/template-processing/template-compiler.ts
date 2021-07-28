import { log } from "../../external-services";
// import Handlebars from "handlebars/dist/handlebars.js"
// import "handlebars/types/index"
import { stringCaseHelpers } from "../../libs/string-case-helpers";
import Handlebars from 'handlebars/dist/cjs/handlebars';
import { stringify } from 'yaml'

const helpers = {

    /**
     * Object to JSON
     * @param o Object to be converted to JSON.
     */
    json(o: any): string {
        return JSON.stringify(o, null, 4)
    },
    yaml(o: any): string {
        return stringify(o, { indent: 4 })
    },
    concat() {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    },
    subtract() {
        return (arguments[0] - arguments[1]).toString()
    },
    repeat(text:string) {
        return text.repeat(arguments[1])
    }
}
// const customHelpers = Object.entries(Object.entries(helpers) as any).concat(stringCaseHelpers as any[])
const customHelpers = Object.entries(stringCaseHelpers).concat(Object.entries(helpers))
customHelpers.map(([name, fn]) => Handlebars.registerHelper(name, fn))

// Object.entries(stringCaseHelpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))
// Object.entries(helpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))

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

export class TemplateCompiler {
    compileTemplate(template: string, model): string {
        try {
            var compiledTemplate = Handlebars.compile(template);

            //TODO: validate: the test must have When and Then at least.
            return compiledTemplate(model)
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

//https://github.com/helpers/handlebars-helpers#install