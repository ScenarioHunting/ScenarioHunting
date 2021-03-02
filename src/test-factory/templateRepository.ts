/* eslint-disable no-undef */

import { isNullOrUndefined } from "./isNullOrUndefined";



// import { isNullOrUndefined } from "util";
export function getTemplateRepository(): templateRepository {
    var repo = new templateRepository()

    sampleTemplates.forEach(({ name, content }) =>
        repo.createOrReplaceTemplate(name, content))

    return repo
}
class templateRepository {
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
    public async getTemplateContentByName(templateName: string): Promise<string> {
        var widgets = await miro.board.widgets.get({
            "metadata": {
                [miro.getClientId()]: {
                    "role": this.role,
                    "templateName": templateName
                }
            }
        });
        if (widgets.length == 0)
            throw new Error("Widget not found");
        if (isNullOrUndefined(widgets[0].metadata[miro.getClientId()].templateContent))
            throw new Error("Widget not found for template:" + templateName);

        var restoredTemplate = widgets[0].metadata[miro.getClientId()].templateContent;
        return restoredTemplate;
    }
}
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
