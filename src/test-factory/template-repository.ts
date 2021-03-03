/* eslint-disable no-undef */

import { isNullOrUndefined } from "./isNullOrUndefined";
const role = "CRT.Templates";

class templateRepository {
    constructor() {
        // miro.board.widgets.get({
        //     "metadata": {
        //         [miro.getClientId()]: {
        //             "role": role,
        //         }
        //     }
        // }).then(widgets =>
        //     widgets.forEach(w => {
        //         console.log(`Template :${w.metadata} is found.`)
        //         w.clientVisible = false
        //         miro.board.widgets.update(w)
        //     }))
    }
    public async getAllTemplateNames(): Promise<string[]> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": role,
                }
            }
        });
        var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));
        return dbWidgets.map(w => w.metadata[miro.getClientId()].templateName);
    }
    public async removeTemplate(templateName: string) {
        var widget = await this.findWidgetByTemplateName(templateName)
        miro.board.widgets.deleteById(widget.id)
    }
    public async createOrReplaceTemplate(testCodeTemplate: testCodeTemplate) {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": role,
                    "testTemplate": {
                        "templateName": testCodeTemplate.templateName
                    }
                }
            }
        });
        var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));
        var json = JSON.stringify({ testTemplate: testCodeTemplate, role: role })
        if (dbWidgets.length == 0) {
            console.log("Creating template:", testCodeTemplate)
            miro.board.widgets.create({
                "type": "sticker",
                "text": testCodeTemplate.codeTemplate,
                "metadata": {
                    [miro.getClientId()]: json
                },
                "capabilities": {
                    "editable": false
                },
                "style": {
                    "textAlign": "l"
                },
                "clientVisible": false
            });
            console.log(`template:${testCodeTemplate.templateName} is created successfully.`)
        }
        else {
            console.log("Updating template:", testCodeTemplate)

            var dbWidget = dbWidgets[0];
            dbWidget.metadata[miro.getClientId()].testTemplate = json;
            dbWidget.metadata[miro.getClientId()].clientVisible = false;

            miro.board.widgets.update(dbWidget);
            console.log(`template:${testCodeTemplate.templateName} is updated successfully.`)

        }
    }
    private async findWidgetByTemplateName(templateName: string): Promise<SDK.IWidget> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": role,
                    "testTemplate": {
                        "templateName": templateName
                    }
                }
            }
        });
        if (widgets.length == 0 || isNullOrUndefined(widgets[0].metadata[miro.getClientId()].codeTemplate))
            throw new Error("Widget not found for template:" + templateName);
        return widgets[0]
    }
    public async getTemplateByName(templateName: string): Promise<testCodeTemplate> {
        var widget = await this.findWidgetByTemplateName(templateName)
        var restoredTemplate = widget.metadata[miro.getClientId()].testTemplate;
        return restoredTemplate;
    }
}
export type testCodeTemplate = {
    templateName: string,
    codeTemplate: string,
    testFileExtension: string,
    testFileNameTemplate: string
}
function addSamplesToRepository(repository: templateRepository) {
    const sampleTemplates: testCodeTemplate[] = [
        {
            testFileNameTemplate: "{{testName}}",
            testFileExtension: "cs",
            codeTemplate: `using StoryTest;
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
    new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}

    public class {{testName}} : IStorySpecification
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
}`,
            templateName: "sample-template"
        }
    ]
    sampleTemplates.forEach(repository.createOrReplaceTemplate)
}


export async function getTemplateRepository(): Promise<templateRepository> {

    var singletonInstance = new templateRepository()//Upfront instantiation to hide the widgets on init
    addSamplesToRepository(singletonInstance)
    return singletonInstance
}