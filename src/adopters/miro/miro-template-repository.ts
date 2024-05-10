import { ITemplateRepository } from '../../app/ports/itemplate-repository'
import { textTemplate } from "../../app/ports/text-template";
import { log } from "../../external-services";
export class miroTemplateRepository implements ITemplateRepository {
    public async getAllTemplateNames(): Promise<string[]> {
        return Object.keys(await miro.board.getAppData())
            .filter(k => k.startsWith(keyPrefix))
            .map(k => k.slice(keyPrefix.length))
    }
    public removeTemplate(templateName: string): Promise<void> {
        return miro.board.setAppData(keyFor(templateName), undefined)
    }
    public createOrReplaceTemplate(template: textTemplate) {
        log.log("Creating template:", template)
        return miro.board.setAppData(keyFor(template.templateName), template)
    }
        
    public async getTemplateByName(templateName: string): Promise<textTemplate | undefined> {
        return await miro.board.getAppData(keyFor(templateName))
    }
}
const keyPrefix = 'template-'
const keyFor = templateName => keyPrefix + templateName
