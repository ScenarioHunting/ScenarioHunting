/* eslint-disable no-unused-vars */
export type textTemplate = {
    templateName: string,
    contentTemplate: string,
    fileNameTemplate: string
    fileExtension: string,
}
export interface iTemplateRepository {
    createOrReplaceTemplate(originalTemplateName: string, template: textTemplate): Promise<void>
    getAllTemplateNames(): Promise<string[]>
    removeTemplate(templateName: string)
    getTemplateByName(templateName: string): Promise<textTemplate>
}