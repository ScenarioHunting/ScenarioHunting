// eslint-disable-next-line no-unused-vars
import { use, should } from 'chai';
use(require('chai-as-promised'));

import { textTemplate } from '../ports/text-template';
import { ITemplateRepository } from '../../app/ports/itemplate-repository';
import { decorateRepositoryWithTemplates } from './default-template-repository-decorator';

const randomString = () => Math.random().toString(36).substring(7);
const aRandomTextTemplate = (): textTemplate => {
  return {
    contentTemplate: randomString(),
    fileExtension: randomString(),
    fileNameTemplate: randomString(),
    templateName: randomString(),
  };
};

// const aRandomTextTemplate = () => new validTextTemplate(aRandomTextTemplate())

class InMemoryTemplateRepository implements ITemplateRepository {
  
  // eslint-disable-next-line no-unused-vars
  constructor(private templates: textTemplate[] = []) {
  }

  getTemplateByName(name: string): Promise<textTemplate|undefined> {
    const result = this.templates.find(t => t.templateName == name);
    return Promise.resolve(result);
  }
  getAllTemplateNames(): Promise<string[]> {
    return Promise.resolve(this.templates.map(t => t.templateName));
  }
  async createOrReplaceTemplate(template: textTemplate) {
    const r = await this.getTemplateByName(template.templateName);
    if (r) {
      this.removeTemplate(template.templateName);
    }
    this.templates = this.templates.concat([template]);
  }
  removeTemplate(templateName: string): Promise<void> {
    this.templates = this.templates.filter(t => t.templateName != templateName);
    return Promise.resolve();
  }

}
describe('defaultTemplateRepositoryDecorator', () => {
  it('remembers the default template names', async () => {
    const defaultTemplate = aRandomTextTemplate();
    const usersTemplate = {
      ...aRandomTextTemplate()
      , templateName: defaultTemplate.templateName
    };

    const repository = decorateRepositoryWithTemplates(new InMemoryTemplateRepository(), [defaultTemplate]);
    await repository.createOrReplaceTemplate(usersTemplate);
    return repository.getTemplateByName(defaultTemplate.templateName)
      .should.eventually.eq(usersTemplate);

  });
  it('overrides the default template names', () => {
    const expected = aRandomTextTemplate();

    return decorateRepositoryWithTemplates(new InMemoryTemplateRepository(), [expected])
      .getAllTemplateNames()
      .should.eventually.contain(expected.templateName);

  });
  it('finds the default templates by their name', () => {
    const expected = aRandomTextTemplate();

    const repository = decorateRepositoryWithTemplates(new InMemoryTemplateRepository(), [expected]);
    repository.getTemplateByName(expected.templateName)
      .should.eventually.eq(expected);

  });
  it('doesn\'t remove default templates', () => {
    const expected = aRandomTextTemplate();

    const repository = decorateRepositoryWithTemplates(new InMemoryTemplateRepository(), [expected]);
    repository.removeTemplate(expected.templateName)
      .should.eventually.be.rejected;

  });
  const subjects = (): ITemplateRepository[] => [
    decorateRepositoryWithTemplates(new InMemoryTemplateRepository(), [])
  ];
  for (const subject of subjects()) {
    it('creates and remembers templates', async () => {

      const expected = aRandomTextTemplate();

      await subject.createOrReplaceTemplate(expected);

      return subject.getTemplateByName(expected.templateName)
        .should.eventually.eq(expected);
    });
    it('requires template name', () => {

      const expected = { ...aRandomTextTemplate(), templateName: ' ' };

      subject.createOrReplaceTemplate(expected)
        .should.eventually.rejectedWith('Template name is required!');

    });
    it('requires template content', () => {

      const expected = { ...aRandomTextTemplate(), contentTemplate: ' ' };

      subject.createOrReplaceTemplate(expected)
        .should.eventually.rejectedWith('Template content is required!');

    });
    it('requires target file extension', () => {

      const expected = { ...aRandomTextTemplate(), fileExtension: ' ' };

      subject.createOrReplaceTemplate(expected)
        .should.eventually.rejectedWith('Template\'s target file extension template is required!');

    });
    it('requires target file name', () => {

      const expected = { ...aRandomTextTemplate(), fileNameTemplate: ' ' };

      subject.createOrReplaceTemplate(expected)
        .should.eventually.rejectedWith('Template\'s target file name template is required!');
    });


    it('remembers all templates', async () => {

      const expected = aRandomTextTemplate();

      await subject.createOrReplaceTemplate(expected);

      return subject.getAllTemplateNames()
        .should.eventually.contain(expected.templateName);
    });
    it('removes templates', async () => {

      const unexpected = aRandomTextTemplate();

      await subject.createOrReplaceTemplate(unexpected);

      subject.removeTemplate(unexpected.templateName);
      return subject.getAllTemplateNames()
        .should.not.eventually.contain(unexpected.templateName);
    });
  }

});
