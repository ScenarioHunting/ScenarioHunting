import { iTemplateRepository, textTemplate } from '../../app/ports/itemplate-repository';

const KeyPrefix = "TemplateRepository-"
export class localStorageTemplateRepository implements iTemplateRepository {

    createOrReplaceTemplate(originalTemplateName: string, newTemplate: textTemplate) {
        console.log("Saving template to local storage:", newTemplate)
        // console.log('Before saving:')
        // this.dumpAll()
        if (originalTemplateName) {
            this.removeTemplate(originalTemplateName)
        }
        localStorage.setItem(KeyPrefix + newTemplate.templateName, JSON.stringify(newTemplate))
        console.log('After saving:')
        this.dumpAll()
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
    private async dumpAll() {
        const templateNames = await this.getAllTemplateNames()
        const templates = templateNames.map(this.getTemplateByName)
        templates.forEach(t => t.then(console.log))
    }
}
