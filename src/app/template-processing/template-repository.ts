// import { log } from '../../libs/logging/log';
const log = console
/* eslint-disable no-undef */
class templateRepository {
    // constructor() {
    //     miro.board.widgets.get({
    //         metadata: {
    //             [miro.getClientId()]: {
    //                 "role": role,
    //             }
    //         }
    //     }).then(widgets =>
    //         widgets.forEach(w => {
    //             logger.log(`Template :${w.metadata} is found.`)
    //             w.clientVisible = false
    //             miro.board.widgets.update(w).then(() => logger.log("The template widgets are hidden."))
    //         }))
    // }
    public async getAllTemplateNames(): Promise<string[]> {
        var widgets = await this.findAllTemplateWidgets()
        return widgets
            .map(w => {
                log.log('template:' + w.metadata[miro.getClientId()]["templateName"] + "found!")
                return w.metadata[miro.getClientId()]["templateName"]
            });
    }
    public async removeTemplate(templateName: string) {
        var widgets = await this.findWidgetByTemplateName(templateName)
        widgets.forEach(async widget => await miro.board.widgets.deleteById(widget.id))
    }
    public async createOrReplaceTemplate(originalTemplateName: string, template: textTemplate) {
        log.log('createOrReplaceTemplate:')
        log.log('finding widget for template:', originalTemplateName)
        var widgets = await this.findAllTemplateWidgets()
        var x: number;
        var y: number;
        if (widgets.length > 0) {
            const firstWidget = widgets[0]
            x = firstWidget.x
            y = firstWidget.y
        } else {
            const viewport = await miro.board.viewport.get()
            x = viewport.x - 200
            y = viewport.y - 200
        }
        widgets = this.filterWidgetsByTemplateName(widgets, originalTemplateName)
        log.log(`${widgets.length} widgets found for template with name: ${originalTemplateName}`)

        // var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));

        if (widgets.length == 0) {
            log.log("Creating template:", template)
            await miro.board.widgets.create({
                type: "TEXT",
                text: template.contentTemplate,
                metadata: {
                    [miro.getClientId()]: template
                },
                capabilities: {
                    editable: false
                },
                style: {
                    textAlign: "l"
                },
                x: x,
                y: y,
                // clientVisible: false
            });
            log.log(`template: ${template.templateName} is created successfully.`)
        }
        else {
            log.log("Updating template:", template)

            var dbWidget = widgets[0];
            // dbWidget["test"] = template.contentTemplate
            dbWidget.metadata[miro.getClientId()] = template;
            // dbWidget.metadata[miro.getClientId()].clientVisible = false;

            await miro.board.widgets.update(dbWidget);
            log.log(`template:${template.templateName} is updated successfully.`)

        }
    }
    private async findAllTemplateWidgets(): Promise<SDK.ITextWidget[]> {
        // var stat = (await miro.board.widgets.get()).filter(x => x.type == 'TEXT' && x["text"].includes('using'))
        // logger.log("# of widgets contain using in their text:", stat.length)
        var widgets = await miro.board.widgets.get()

        // logger.log("# of widgets that have metadata.clientId.templateName:", widgets.filter(i => i.metadata && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()]["templateName"]).length)

        return widgets
            .filter(i => i.type == 'TEXT'
                && i.metadata && i.metadata[miro.getClientId()]
                && i.metadata[miro.getClientId()]
                && i.metadata[miro.getClientId()]["templateName"]) as SDK.ITextWidget[]
    }
    private filterWidgetsByTemplateName(widgets: SDK.ITextWidget[], templateName): SDK.ITextWidget[] {
        return widgets.filter(w => w.metadata[miro.getClientId()]["templateName"] == templateName)
    }
    private async findWidgetByTemplateName(templateName: string): Promise<SDK.IWidget[]> {
        return this.filterWidgetsByTemplateName(
            await this.findAllTemplateWidgets()
            , templateName)
    }
    public async getTemplateByName(templateName: string): Promise<textTemplate> {
        var widgets = await this.findWidgetByTemplateName(templateName)
        if (widgets.length == 0)
            throw new Error("Widget not found for template:" + templateName);
        log.log("Widgets found:", widgets)
        var template = widgets[0].metadata[miro.getClientId()];
        log.log("Corresponding metadata:", widgets[0].metadata[miro.getClientId()])
        log.log("Corresponding template:", template)
        return template
    }
}
export type textTemplate = {
    templateName: string,
    contentTemplate: string,
    fileNameTemplate: string
    fileExtension: string,
}
async function addSamplesToRepository(repository: templateRepository) {
    const sampleTemplates: textTemplate[] = [
        {
            fileNameTemplate: "{{scenario}}",
            fileExtension: "cs",
            contentTemplate: `using StoryTest;
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

    public class {{scenario}} : IStorySpecification
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
        },
        {
            fileNameTemplate: "{{scenario}}2",
            fileExtension: "cs",
            contentTemplate: `using StoryTest;
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

    public class {{scenario}} : IStorySpecification
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
            templateName: "sample-template2"
        },
    ]
    for (var i = 0; i < sampleTemplates.length; i++) {
        await repository.createOrReplaceTemplate(sampleTemplates[i].templateName, sampleTemplates[i])
    }
    // sampleTemplates.forEach(async x => await repository.createOrReplaceTemplate(x))
}


export async function getTemplateRepository(): Promise<templateRepository> {
    return new templateRepository()
}

export async function createOrUpdateSampleTemplates() {
    var singletonInstance = new templateRepository()
    await addSamplesToRepository(singletonInstance)
}