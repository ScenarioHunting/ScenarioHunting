/* eslint-disable no-undef */
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
function saveAs(fileName: string, data: string) {
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
        var result = await generateTestCode(dtoToJsonSchema(dto))
        saveAs(result.testName, result.testCode)

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
        context: dto.context,
        testName: dto.testName,
    }
}
class templateRepository {
    private role = "CRT.Templates"
    public async getAllTemplateNames(): Promise<string[]> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                }
            }
        })
        var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName))
        return dbWidgets.map(w => w.metadata[miro.getClientId()].templateName)
    }
    public async addTemplate(templateName: string, templateContent: string) {
        // eslint-disable-next-line no-undef
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                    "templateName": templateName,
                }
            }
        })
        var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName))
        if (dbWidgets.length == 0) {
            // eslint-disable-next-line no-undef
            miro.board.widgets.create({
                "type": "sticker",
                "text": templateContent,
                "metadata": {
                    [miro.getClientId()]: {
                        "role": this.role,
                        "templateName": templateName,
                        "templateContent": templateContent,
                    }
                },
                "capabilities": {
                    "editable": false
                },
                "style": {
                    "textAlign": "l"
                },
                "clientVisible": false
            })
        } else {
            var dbWidget = dbWidgets[0]
            dbWidget["templateContent"] = templateContent
            dbWidget.metadata[miro.getClientId()].templateContent = templateContent
            dbWidget.metadata[miro.getClientId()].clientVisible = false
            // dbWidget.metadata[miro.getClientId()].templateContent = template
            // eslint-disable-next-line no-undef
            miro.board.widgets.update(dbWidget)
        }
    }
    public async getTemplateContentByName(templateName: string): Promise<string> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                    "templateName": templateName
                }
            }
        })
        if (widgets.length == 0)
            throw new Error("Widget not found")
        if (isNullOrUndefined(widgets[0].metadata[miro.getClientId()].templateContent))
            throw new Error("No template in the widget")

        var restoredTemplate = widgets[0].metadata[miro.getClientId()].templateContent
        return restoredTemplate
    }
}
//********************** */
async function generateTestCode(testSchema): Promise<{ testName: string, testCode: string }> {
    var testTemplateRepository = new templateRepository()

    var templateContent = `using StoryTest;
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
    // var text = "CRT DB Can be moved around, but don't delete, and don't copy, or create other objects with this content)"
    var templateName = "csharp-domain-model-unit-test"
    // var role = "CRT.Templates"
    //<Upsert templates:>
    await testTemplateRepository.addTemplate(templateName, templateContent)
    // eslint-disable-next-line no-undef
    // var widgets = await miro.board.widgets.get({
    //     "metadata": {
    //         [miro.getClientId()]: {
    //             "role": role,
    //             "templateName": templateName,
    //         }
    //     }
    // })
    // var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName))
    // if (dbWidgets.length == 0) {
    //     // eslint-disable-next-line no-undef
    //     miro.board.widgets.create({
    //         "type": "sticker",
    //         "text": templateContent,
    //         "metadata": {
    //             [miro.getClientId()]: {
    //                 "role": role,
    //                 "templateName": templateName,
    //                 "templateContent": templateContent,
    //             }
    //         },
    //         "capabilities": {
    //             "editable": false
    //         },
    //         "style": {
    //             "textAlign": "l"
    //         },
    //         "clientVisible": false
    //     })
    // } else {
    //     var dbWidget = dbWidgets[0]
    //     dbWidget["templateContent"] = templateContent
    //     dbWidget.metadata[miro.getClientId()].templateContent = templateContent
    //     dbWidget.metadata[miro.getClientId()].clientVisible = false
    //     // dbWidget.metadata[miro.getClientId()].templateContent = template
    //     // eslint-disable-next-line no-undef
    //     miro.board.widgets.update(dbWidget)
    // }
    //</Upsert templates>





    Handlebars.registerHelper('skipLast', function (options) {
        if (options.data.last) {
            return options.inverse()
        } else {
            return options.fn()
        }
    })

    var restoredTemplate = await testTemplateRepository.getTemplateContentByName(templateName)
    console.log("TEMPLATE CONTENT:", restoredTemplate)
    //</find template:>

    //Conditional template loading
    // Handlebars.registerPartial('')
    var compiledTemplate = Handlebars.compile(restoredTemplate);
    
    //TODO: validate: the test must have When and Then at least.
    var testCode = compiledTemplate(testSchema)
    console.log("TestName:", restoredTemplate)
    console.log("TestSchema:", restoredTemplate)
    // console.log(finalText);
    return testSchema.testName, testCode
}
