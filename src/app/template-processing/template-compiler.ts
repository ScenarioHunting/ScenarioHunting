import Handlebars from "handlebars/dist/handlebars.js"
Handlebars.registerHelper('skipLast', function (options) {
    if (options.data.last) {
        return options.inverse()
    } else {
        return options.fn()
    }
})

export function compileTemplate(template: string, testSchema): string {




    var compiledTemplate = Handlebars.compile(template);

    //TODO: validate: the test must have When and Then at least.
    return compiledTemplate(testSchema)
}
