
// var repository=require("templateRepository").getTemplateRepository()
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
console.log("template obj:", getTemplateByName(getParameterByName("templateName")))
// alert("templateName :" + getParameterByName("templateName"))
// alert("templateContent :" + getParameterByName("templateContent"))
// console.log("templateContent :", getParameterByName("templateContent"))
// console.log("templateContentObj :", getParameterByName("templateContentObj"))

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' } });
window.MonacoEnvironment = { getWorkerUrl: () => proxy };
let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min'
    };
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/base/worker/workerMain.min.js');
`], { type: 'text/javascript' }));


require(["vs/editor/editor.main"], function () {
    // monaco.languages.registerDocumentFormattingEditProvider('csharp', {
    //     provideDocumentFormattingEdits: function (model, options, token) {
    //         return [
    //             {
    //                 range: {
    //                     startLineNumber: 1,
    //                     startColumn: 1,
    //                     endLineNumber: 1,
    //                     endColumn: 1
    //                 },
    //                 text: 'a'
    //             }
    //         ];
    //     }
    // });
    // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    //     allowNonTsExtensions: true
    // });
    // monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    //     {
    //         noLib: true,
    //         allowNonTsExtensions: true
    //     });
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
    // monaco.languages.registerCompletionItemProvider('CustomExpressionLanguage', {
    //     provideCompletionItems: () => {
    //         if (!items || items.length <= 0)
    //             return { suggestions: [] };

    //         window.varSuggestions = items.map(function (x) {
    //             const one = {
    //                 label: x.Value,
    //                 kind: monaco.languages.CompletionItemKind.Keyword,
    //                 insertText: `Col("${x.Key}")`,
    //                 insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    //             };
    //             return one;
    //         });

    //         window.pythonSuggestions = window.pythonMathMethods.map((x) => {
    //             var item = {
    //                 label: x.label,
    //                 kind: monaco.languages.CompletionItemKind.Funcion,
    //                 insertText: `${x.label}${x.arguments}`,
    //                 documentation: x.documentation,
    //                 insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    //             };
    //             return item;
    //         });

    //         window.suggestions = window.varSuggestions.concat(window.pythonSuggestions);
    //         return { suggestions: window.suggestions };
    //     }
    // });

    // const defModel = monaco.editor.createModel(
    //     "var helloWorld = \"Hello World!\";",
    //     "csharp"
    // )

    // const textModel = monaco.editor.createModel(
    //     "helloWorld()",
    //     "csharp"
    // )

    let editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{Sut}};
using Vlerx.SampleService.{{Sut}};
using Vlerx.SampleService.{{Sut}}.Commands;
using Vlerx.SampleService.Tests.StoryTests;
using Xunit;

namespace Vlerx.SampleService.Tests
{
    {{#* inline "callConstructor"}}
    new {{title}}({{#each properties}}{{example}}{{#skipLast}},{{/skipLast}}{{/each}})
    {{/inline}}

    public class Rel : IStorySpecification
    {
        public IDomainEvent[] Given
        => new IDomainEvent[]{
    {{#each givens}}
        {{> callConstructor .}},
    {{/each}}
        };
        public ICommand When
        => {{> callConstructor when}}
        public IDomainEvent[] Then
        => new IDomainEvent[]{
    {{#each thens}}
        {{> callConstructor .}},
    {{/each}}
        };

        public string Sut { get; } = nameof({{Sut}});

        [Fact]
        public void Run()
        => TestAdapter.Test(this
                , setupUseCases: eventStore =>
                     new[] {
                        new {{Sut}}UseCases(new Repository<{{Sut}}.State>(eventStore))
                     });
    }
}`,
        language: 'csharp',
        // language: 'csharp',
        theme: 'vs-dark',
        // theme: 'monokai',
        lineHeight: 20,
        fontSize: 14,
        // wordWrap: "bounded",
        automaticLayout: true,
        wrappingIndent: 'indent',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        formatOnType: true//!important
    });

    // editor.trigger(‘anyString’, 'editor.action.formatDocument'); 
    // console.log(monaco.editor.getModels())
    // editor.setModel(textModel)
});