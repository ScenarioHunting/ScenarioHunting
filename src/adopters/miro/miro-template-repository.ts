/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { BaseItem } from '@mirohq/websdk-types';
import { ITemplateRepository } from '../../app/ports/itemplate-repository'
import { textTemplate } from "../../app/ports/text-template";
import { log } from "../../external-services";
export class miroTemplateRepository implements ITemplateRepository {
    private async getAllTemplates() {
        var widgets = await this.findAllTemplateWidgets()
        return widgets.map(w => w.getMetadata("template") as unknown as textTemplate)
    }

    public async getAllTemplateNames(): Promise<string[]> {
        // var widgets = await this.getAllTemplates()
        // return widgets.map(w => w["templateName"])
        return Object.keys(await miro.board.getAppData()).filter(k=>k.startsWith(keyPrefix)).map(k=>k.slice(keyPrefix.length))
    }
    public removeTemplate(templateName: string): Promise<void> {
        // var widgets = await this.findWidgetByTemplateName(templateName)
        // for (const widget of widgets)
        //     await miro.board.remove(widget)
return        miro.board.setAppData(keyFor(templateName),undefined)
    }
    public createOrReplaceTemplate(template: textTemplate) {
        log.log("Creating template:",template)
        return miro.board.setAppData(keyFor(template.templateName),template)
        // var widgets = await this.findAllTemplateWidgets()
        // var x: number;
        // var y: number;
        // if (widgets.length > 0) {

        //     const firstWidget = widgets[0]
        //     x = firstWidget.x
        //     y = firstWidget.y
        // } else {
        //     const viewport = await miro.board.viewport.get()
        //     x = viewport.x - 200
        //     y = viewport.y - 200
        // }
        // log.log('Finding widget for template:', template.templateName)
        // widgets = this.filterWidgetsByTemplateName(widgets, template.templateName)
        // log.log(`"${widgets.length}" widgets found for template originally named: ${template.templateName}`)

        // // var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));

        // if (widgets.length == 0) {
        //     log.log("Creating template:", template)
        //     const text= await miro.board.createText({
        //         content: template.contentTemplate,
                
        //         // capabilities: {
        //         //     editable: false
        //         // },
        //         style: {
        //             textAlign: "left"
        //         },
        //         x: x,
        //         y: y,
        //         // clientVisible: false
        //     });
        //     text.setMetadata("template",template)
        //     log.log(`template: ${template.templateName} is created successfully.`)
        // }
        // else {
        //     log.log("Updating template:", template)

        //     var dbWidget = widgets[0];
        //     dbWidget.setMetadata("template",template);
        //     // dbWidget.metadata[miro.getClientId()].clientVisible = false;
        //     await dbWidget.sync()
        //     // await miro.board.widgets.update(dbWidget);
        //     log.log(`template:${template.templateName} is updated successfully.`)

        // }
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

    private async findAllTemplateWidgets(): Promise<BaseItem[]> {
        await this.waitUntil(() => miro.board)
        var widgets = await miro.board.get({type:"text"})

        return widgets
            .filter(i => i.getMetadata("template")??["templateName"])
            .map(i=> i as BaseItem)
    }
    private filterWidgetsByTemplateName(widgets: BaseItem[], templateName): BaseItem[] {
        const x= widgets.filter(async w => {
          const r=  templateName == await w.getMetadata("template")['templateName']
          console.log("templateName == await w.getMetadata('templateName')['templateName']",r)
          console.log({templateName, checking:await w.getMetadata("template")['templateName'],metadata:await w.getMetadata()})
        })
        console.log("Filtered widgets:",x)
        return x
    }
    private async findWidgetByTemplateName(templateName: string): Promise<BaseItem[]> {
        const widgets = await this.findAllTemplateWidgets()
        return this.filterWidgetsByTemplateName(widgets, templateName)
    }
    public async getTemplateByName(templateName: string): Promise<textTemplate|undefined> {
        // var widgets = await this.findWidgetByTemplateName(templateName)
        // if (widgets.length == 0)
        //     throw new Error("Widget not found for template:" + templateName);
        // log.log(`Widgets found for "${templateName}" template:`, widgets)
        // var template = await widgets[0].getMetadata("template");
        // log.log("Corresponding metadata:", await widgets[0].getMetadata("template"))
        // log.log("Corresponding template:", template)
        // return template as unknown as textTemplate
        const template=await miro.board.getAppData(keyFor(templateName))
        console.log("Template got by name:", {template,
            appData: await miro.board.getAppData()
        })
        return template
    }
}
const keyPrefix = 'template-'
const keyFor=templateName=>keyPrefix+templateName
