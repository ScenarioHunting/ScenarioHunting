import { iTemplateRepository, textTemplate } from '../../app/ports/itemplate-repository';

const KeyPrefix = "TemplateRepository-"
export class localStorageTemplateRepository implements iTemplateRepository {

    createOrReplaceTemplate(originalTemplateName: string, newTemplate: textTemplate) {
        console.log("Saving template to local storage:", newTemplate)
        if (originalTemplateName) this.removeTemplate(originalTemplateName)
        localStorage.setItem(KeyPrefix + newTemplate.templateName, JSON.stringify(newTemplate))
    }
    getAllTemplateNames(): Promise<string[]> {
        return Promise.resolve(Object.keys(localStorage).map(t => t.substr(KeyPrefix.length)))
    }
    removeTemplate(templateName: string) {
        localStorage.removeItem(KeyPrefix + templateName)
    }
    getTemplateByName(templateName: string): Promise<textTemplate> {
        const item = localStorage.getItem(KeyPrefix + templateName)
        if (!item) return Promise.reject("Template not found!")
        return Promise.resolve((<textTemplate>JSON.parse(item)))
    }
    private dumpAll = async () =>
        (await this.getAllTemplateNames())
        .forEach(t => this.getTemplateByName(t).then(console.log))

}
