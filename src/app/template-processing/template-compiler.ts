import Handlebars from "handlebars/dist/handlebars.js"
import { templateFunctions } from "./template-functions";


Handlebars.registerHelper('skipLast', (options) =>
    options.data.last
        ? options.inverse()
        : options.fn()
)

Object.entries(templateFunctions).map(([name, fn]) => Handlebars.registerHelper(name, fn))




export function compileTemplate(template: string, testSchema): string {




    var compiledTemplate = Handlebars.compile(template);

    //TODO: validate: the test must have When and Then at least.
    return compiledTemplate(testSchema)
}
