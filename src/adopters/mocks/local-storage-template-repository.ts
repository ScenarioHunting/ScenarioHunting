import { iTemplateRepository, textTemplate } from '../../app/ports/itemplate-repository';

export class localStorageTemplateRepository implements iTemplateRepository {

    createOrReplaceTemplate(originalTemplateName: string, newTemplate: textTemplate) {
        localStorage.setItem(originalTemplateName, JSON.stringify(newTemplate))
    }
    getAllTemplateNames(): Promise<string[]> {
        return Promise.resolve(Object.keys(localStorage))
    }
    removeTemplate(templateName: string) {
        localStorage.removeItem(templateName)
    }
    getTemplateByName(templateName: string): Promise<textTemplate> {
        const item = localStorage.getItem(templateName)
        if (!item)
            return Promise.reject("Template not found!")
        return Promise.resolve((<textTemplate>JSON.parse(item)))
    }
}
