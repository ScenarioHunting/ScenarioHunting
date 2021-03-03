/* eslint-disable no-undef */

import { isNullOrUndefined } from "./isNullOrUndefined";

class templateRepository {
    constructor() {
        var role = "CRT.Templates"
        // eslint-disable-next-line no-undef
        miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": role,
                }
            }
        }).then(widgets =>
            widgets.forEach(w => {
                w.clientVisible = false
                // eslint-disable-next-line no-undef
                miro.board.widgets.update(w)
            }))
    }
    private role = "CRT.Templates";
    public async getAllTemplateNames(): Promise<string[]> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
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
    public async createOrReplaceTemplate(templateName: string, templateContent: string) {

        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                    "templateName": templateName,
                }
            }
        });
        var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));
        if (dbWidgets.length == 0) {

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
            });
        }
        else {
            var dbWidget = dbWidgets[0];
            dbWidget["templateContent"] = templateContent;
            dbWidget.metadata[miro.getClientId()].templateContent = templateContent;
            dbWidget.metadata[miro.getClientId()].clientVisible = false;

            miro.board.widgets.update(dbWidget);
        }
    }
    private async findWidgetByTemplateName(templateName: string): Promise<SDK.IWidget> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                    "templateName": templateName
                }
            }
        });
        if (widgets.length == 0 || isNullOrUndefined(widgets[0].metadata[miro.getClientId()].templateContent))
            throw new Error("Widget not found for template:" + templateName);
        return widgets[0]
    }
    public async getTemplateContentByName(templateName: string): Promise<string> {
        var widget = await this.findWidgetByTemplateName(templateName)
        var restoredTemplate = widget.metadata[miro.getClientId()].templateContent;
        return restoredTemplate;
    }
}

function addSamplesToRepository(repository: templateRepository) {
    const sampleTemplates = [
        {
            content: `using StoryTest;
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
}`,
            name: "sample-template.cs"
        }
    ]
    sampleTemplates.forEach(({ name, content }) =>
        repository.createOrReplaceTemplate(name, content))
}


export async function getTemplateRepository(): Promise<templateRepository> {
    
    var singletonInstance = new templateRepository()//Upfront instantiation to hide the widgets on init
    addSamplesToRepository(singletonInstance)
    return singletonInstance
}