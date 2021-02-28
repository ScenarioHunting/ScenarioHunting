import { IndexedStep } from "./given-collection"
import { CreateTestDto, IndexedStepDataDto, StepDataDto } from "./dto"
import { SelectedWidget } from "board"
import Handlebars from "handlebars/dist/handlebars.js"
import { isNullOrUndefined } from "util"

const toDto = ({ testContext
    , testName
    , sutName

    , givens
    , when
    , then }: LocalTestCreationResult): CreateTestDto => {

    return {
        context: testContext,
        testName: testName,
        test: {
            givens: givens.map(indexedStep => {
                return {
                    step: indexedStep.step.widgetData,
                    // step: {
                    //     type: indexedStep.step.data.type,
                    //     properties: indexedStep.step.data.properties.map(p => p as StepDataPropertyDto)
                    // },
                    index: indexedStep.index
                } as IndexedStepDataDto
            }),
            when: when.widgetData,
            thens: [{ step: then.widgetData, index: 0 } as IndexedStepDataDto],
            sut: sutName,
        },
        metadata: {
            contents: JSON.stringify({
                given: givens.map(given => { given.step.widgetSnapshot, given.index }),
                when: when.widgetSnapshot,
                then: [{ step: then.widgetSnapshot, index: 0 }]
            })
        }
    }
}

export type LocalTestCreationResult = {
    testContext: string
    , testName: string
    , sutName: string

    , givens: IndexedStep[]
    , when: SelectedWidget
    , then: SelectedWidget
}
function saveAs(data, fileName) {
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    if (isNullOrUndefined(window.navigator.msSaveOrOpenBlob)) {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
    else {
        window.navigator.msSaveBlob(blob, fileName);
    }
}
export async function Save(test: LocalTestCreationResult, onSuccess, onError) {
    try {
        const dto = toDto(test)

        var requestBody = JSON.stringify(dto);
        var testCode = await generateTestBody(dto)
        // var blob = new Blob([JSON.stringify(testCode)], { type: "text/plain;charset=utf-8" });
        // FileSaver.saveAs(blob, "testName.cs");
        saveAs(testCode, 'testName.cs')
        // console.log('testCode:');
        // console.log(testCode);

        const response = await fetch('http://localhost:6000/Tests',//TODO: read it from config file
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: requestBody
            });
        if (response.ok)
            onSuccess()
        else
            onError(response.statusText)
    }
    catch (error) {
        onError(error)
    }

}

//********************** */
async function generateTestBody(dto: CreateTestDto): Promise<string> {

    function dtoToJsonSchema(dto: CreateTestDto) {
        function stepToJsonSchema(step: StepDataDto) {
            var props = {}
            step.properties.forEach(p => {
                props[p.propertyName] = {
                    type: "string",
                    description: p.propertyName,
                    example: p.simplePropertyValue
                }
            })
            return {
                $schema: "http://json-schema.org/draft-07/schema#",
                title: step.type,
                type: "object",
                properties: props
            }
        }
        return {
            givens: dto.test.givens.map(given => stepToJsonSchema(given.step)),
            when: stepToJsonSchema(dto.test.when),
            thens: dto.test.thens.map(then => stepToJsonSchema(then.step)),
            sut: dto.testName,
            context: dto.context
        }
    }
    var sampleTestSchema = dtoToJsonSchema(dto)
    var template = `using StoryTest;
using Vlerx.Es.Messaging;
using Vlerx.Es.Persistence;
using Vlerx.SampleContracts.{{sut}};
using Vlerx.{{context}}.{{sut}};
using Vlerx.{{context}}.{{sut}}.Commands;
using Vlerx.{{context}}.Tests.StoryTests;
using Xunit;

namespace {{context}}.Tests
{
    {{#* inline "callConstructor"}}
    new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}})
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
        => {{> callConstructor when}};
        public IDomainEvent[] Then
        => new IDomainEvent[]{
    {{#each thens}}
        {{> callConstructor .}},
    {{/each}}
        };

        public string Sut { get; } = nameof({{sut}});

        [Fact]
        public void Run()
        => TestAdapter.Test(this
                , setupUseCases: eventStore =>
                     new[] {
                        new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))
                     });
    }
}`
    var text = "CRT DB\nCan be moved around, but don't delete, and don't copy, or create other objects with this content)"
    var templates = [template]
    for (var i = 0; i < 6; i++)
        templates.push(template)

    //<Upsert templates:>
    // eslint-disable-next-line no-undef
    miro.board.widgets.get({ plainText:"CRT DB Can be moved around, but don't delete, and don't copy, or create other objects with this content)"})
        .then(w => {
            var dbWidgets = w.filter(i => !isNullOrUndefined(i.metadata["3074457349056199734"].templates))
            if (dbWidgets.length == 0) {
                // eslint-disable-next-line no-undef
                miro.board.widgets.create({
                    "type": "sticker",
                    "text": text,
                    "metadata": {
                        "3074457349056199734": {
                            "templates": templates
                        }
                    },
                    "capabilities": {
                        "editable": false
                    }
                })
                return;
            }
            var dbWidget = dbWidgets[0]
            dbWidget.metadata["3074457349056199734"].templates.push(template)
            // eslint-disable-next-line no-undef
            miro.board.widgets.update(dbWidget)
        })
    //</Upsert templates>





    Handlebars.registerHelper('skipLast', function (options) {
        if (options.data.last) {
            return options.inverse()
        } else {
            return options.fn()
        }
    })
    //<find template:>
    // eslint-disable-next-line no-undef
    var w = await miro.board.widgets.get({
        "text": text,
    })
    if (w.length == 0)
        throw new Error("Db widget not found")
    if (isNullOrUndefined(w[0].metadata) || isNullOrUndefined(w[0].metadata["3074457349056199734"]) || w[0].metadata["3074457349056199734"].templates.length == 0)
        throw new Error("No template in the metadata of the Db widget")

    var restoredTemplate = w[0].metadata["3074457349056199734"].templates[0]
    //</find template:>

    //Conditional template loading
    // Handlebars.registerPartial('')
    var compiledTemplate = Handlebars.compile(restoredTemplate);
    //TODO: validate: the test must have When and Then at least.
    var finalText = compiledTemplate(sampleTestSchema)
    // console.log(finalText);
    return finalText
}
