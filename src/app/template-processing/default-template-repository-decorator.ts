import { ITemplateRepository } from '../ports/itemplate-repository';
import { textTemplate } from '../ports/text-template';
import { builtinTemplates } from './builtin-templates';

class DefaultTemplateRepositoryDecorator implements ITemplateRepository {
  // eslint-disable-next-line no-unused-vars
  constructor(private customTemplateRepository: ITemplateRepository
    // eslint-disable-next-line no-unused-vars
    , private builtinTemplateRepository: textTemplate[]) { }

  async createOrReplaceTemplate(template: textTemplate): Promise<void> {
    // if(this.builtinTemplateRepository.find())
    if (template.templateName.trim() == '')
      throw Error('Template name is required!');
    if (template.contentTemplate.trim() == '')
      throw Error('Template content is required!');
    if (template.fileExtension.trim() == '')
      throw Error('Template\'s target file extension template is required!');
    if (template.fileNameTemplate.trim() == '')
      throw Error('Template\'s target file name template is required!');

    
    return this.customTemplateRepository.createOrReplaceTemplate(template);
  }

  async getAllTemplateNames(): Promise<string[]> {
    const userCustomTemplateNames = await this.customTemplateRepository.getAllTemplateNames();
    const builtinTemplateNames = this.builtinTemplateRepository.map(t => t.templateName);

    return userCustomTemplateNames
      .concat(builtinTemplateNames)
      .filter((template, index, all) =>//unique (last occurance)
        all.indexOf(template) === index
      );
  }
  removeTemplate(templateName: string) {
    return this.customTemplateRepository.removeTemplate(templateName);
  }

  async getTemplateByName(templateName: string): Promise<textTemplate> {
    let template = await this.customTemplateRepository.getTemplateByName(templateName);
    if (!template)
      template = builtinTemplates.find(t => t.templateName == templateName);
    if (!template)
      throw new Error('Widget not found for template:' + templateName);
    return template;
  }

}

export const decorateRepositoryWithTemplates =
    (repository: ITemplateRepository, readonlyTemplates: textTemplate[]) =>
      new DefaultTemplateRepositoryDecorator(repository, readonlyTemplates);