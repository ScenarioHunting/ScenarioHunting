import { log } from "../../external-services";
// import Handlebars from "handlebars/dist/handlebars.js"
// import "handlebars/types/index"
import { stringCaseHelpers } from "../../libs/string-case-helpers";
// import * as Handlebars from "handlebars";
import Handlebars from 'handlebars/dist/cjs/handlebars'
// import * as RuntimeHandlebars from "handlebars/runtime";
// const Handlebars = Object.assign(MainHandlebars, RuntimeHandlebars);

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

// Handlebars.registerHelper('skipLast', (options) =>
//     options.data.last
//         ? options.inverse()
//         : options.fn()
// )

Object.entries(stringCaseHelpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))
Object.entries(helpers).map(([name, fn]) => Handlebars.registerHelper(name, fn))

Handlebars.registerHelper('helperMissing', function ( /* dynamic arguments */) {
    var options = arguments[arguments.length - 1];
    // const userArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
    console.log("ops:", options)
    throw new Handlebars.SafeString(options.name + " is not defined")
})
// Handlebars.registerHelper('blockHelperMissing', (context, options) => {
//     throw options.name + " is not defined in the block: " + options.fn(context);
// });
Handlebars.registerHelper('blockHelperMissing', function (context, options) {
    throw "dddddddddddddddddddddddddddddd"
    // var inverse = options.inverse || function () { },
    //     fn = options.fn;

    // var type = toString.call(context);

    // if (type === Handlebars.functionType) {
    //     context = context.call(this);
    // }

    // if (context === true) {
    //     return fn(this);
    // } else if (context === false || context == null) {
    //     return inverse(this);
    // } else if (type === "[object Array]") {
    //     if (context.length > 0) {
    //         return Handlebars.helpers.each(context, options);
    //     } else {
    //         return inverse(this);
    //     }
    // } else {
    //     return fn(context);
    // }
});
Handlebars.registerHelper('handleErrors', function (options) {
    try {
        console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
        return options.fn(this)
    } catch (err) {
        log.log("err:", err)
        return 'something that handles the error'
    }
})

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