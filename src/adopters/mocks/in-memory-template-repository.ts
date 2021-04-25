import { iTemplateRepository, textTemplate } from '../../app/ports/itemplate-repository';

export class inMemoryTemplateRepository implements iTemplateRepository {

    private templates: textTemplate[] = []
    createOrReplaceTemplate(originalTemplateName: string, newTemplate: textTemplate) {
        const originalTemplate = this.templates.find(t => t.templateName == originalTemplateName)
        if (originalTemplate) {
            this.templates = this.templates.map(t =>
                t.templateName == originalTemplateName
                    ? newTemplate
                    : t)
            return
        }
        this.templates = this.templates.concat(newTemplate)
    }
    getAllTemplateNames(): Promise<string[]> {
        return Promise.resolve(this.templates.map(t => t.templateName))
    }
    removeTemplate(templateName: string) {
        this.templates = this.templates.filter(t => t.templateName != templateName)
    }
    getTemplateByName(templateName: string): Promise<textTemplate> {
        return Promise.resolve(this.templates.filter(t => t.templateName == templateName)[0])
    }
}
