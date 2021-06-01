/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { ITemplateRepository } from '../../app/ports/itemplate-repository'
import { textTemplate } from "../../app/ports/text-template";
import { log } from "../../external-services";
export class miroTemplateRepository implements ITemplateRepository {
    // constructor() {
    //     miro.board.widgets.get({
    //         metadata: {
    //             [miro.   getClientId()]: {
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
    private async getAllTemplates() {
        var widgets = await this.findAllTemplateWidgets()
        return widgets.map(w => w.metadata[miro.getClientId()])
    }

    public async getAllTemplateNames(): Promise<string[]> {
        var widgets = await this.getAllTemplates()
        return widgets.map(w => w["templateName"])
    }
    public async removeTemplate(templateName: string): Promise<void> {
        var widgets = await this.findWidgetByTemplateName(templateName)
        for (const widget of widgets)
            await miro.board.widgets.deleteById(widget.id)
    }
    public async createOrReplaceTemplate(template: textTemplate) {
        log.log('createOrReplaceTemplate:')
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
        log.log('Finding widget for template:', template.templateName)
        widgets = this.filterWidgetsByTemplateName(widgets, template.templateName)
        log.log(`"${widgets.length}" widgets found for template originally named: ${template.templateName}`)

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
            dbWidget.metadata[miro.getClientId()] = template;
            // dbWidget.metadata[miro.getClientId()].clientVisible = false;

            await miro.board.widgets.update(dbWidget);
            log.log(`template:${template.templateName} is updated successfully.`)

        }
    }
    private waitUntil = (condition) => {
        return new Promise((resolve: (value: any) => void) => {
            let interval = setInterval(() => {
                if (!condition()) {
                    return
                }

                clearInterval(interval)
                resolve(null)
            }, 100)
        })
    }

    private async findAllTemplateWidgets(): Promise<SDK.ITextWidget[]> {
        await this.waitUntil(() => miro.board)
        var widgets = await miro.board.widgets.get()

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
        const widgets = await this.findAllTemplateWidgets()
        return this.filterWidgetsByTemplateName(widgets, templateName)
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
