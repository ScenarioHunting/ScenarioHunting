import { log } from '../../external-services';
import { ITemplateRepository } from '../../app/ports/itemplate-repository';
import { textTemplate } from "../../app/ports/text-template";

const KeyPrefix = "TemplateRepository-"
export class localStorageTemplateRepository implements ITemplateRepository {

    async createOrReplaceTemplate(newTemplate: textTemplate) {
        log.log("Saving template to local storage:", newTemplate)
        if (newTemplate.templateName) this.removeTemplate(newTemplate.templateName)
        localStorage.setItem(KeyPrefix + newTemplate.templateName, JSON.stringify(newTemplate))
    }
    getAllTemplateNames(): Promise<string[]> {
        return Promise.resolve(Object.keys(localStorage).map(t => t.substr(KeyPrefix.length)))
    }
    removeTemplate(templateName: string) {
        return Promise.resolve(localStorage.removeItem(KeyPrefix + templateName))
    }
    getTemplateByName(templateName: string): Promise<textTemplate|undefined> {
        const item = localStorage.getItem(KeyPrefix + templateName)
        if (!item) return Promise.resolve(undefined)
        return Promise.resolve((<textTemplate>JSON.parse(item)))
    }
    private dumpAll = async () =>
        (await this.getAllTemplateNames())
            .forEach(t => this.getTemplateByName(t).then(log.log))

}
