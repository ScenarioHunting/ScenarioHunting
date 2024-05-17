/* eslint-disable no-unused-vars */
import { textTemplate } from './text-template';

export interface ITemplateRepository {
    createOrReplaceTemplate(template: textTemplate): Promise<void>
    getAllTemplateNames(): Promise<string[]>
    removeTemplate(templateName: string): Promise<void>
    getTemplateByName(templateName: string): Promise<textTemplate | undefined>
}