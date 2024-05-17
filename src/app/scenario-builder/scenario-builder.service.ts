import { isNullOrUndefined } from '../../libs/isNullOrUndefined';
import { Api } from '../api';
import { ExternalServices, log } from '../../external-services';
const templateRepository = ExternalServices.templateRepository;
const templateCompiler = ExternalServices.templateCompiler;
function downloadAs(fileName: string, data: string) {
  log.log(`Saving as: file Name: ${fileName} content: ${JSON.stringify(data)}`);
  var blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  if (isNullOrUndefined((<any>window.navigator).msSaveOrOpenBlob)) {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = fileName;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
  else {
    (<any>window.navigator).msSaveBlob(blob, fileName);
  }
}
export class ScenarioBuilderService {
  static Save = async (templateName: string, spec: Api): Promise<string> => {

    log.log('Saving the template for test:', spec.scenario);

    try {
      var template = await templateRepository.getTemplateByName(templateName);
      if (!template) {
        const message = `The template named ${templateName} does not exist.`;
        log.error(message);
        return message;
      }
      log.log('template loaded:', templateName);
    }

    catch (e) {
      log.warn('An error occurred while loading the template:', e);
      return e.toString();
    }

    try {
      // spec = specFormatterService(template.fileExtension).formatSpec(spec)
      // log.info("Spec formatted:", spec)
      var testCode = templateCompiler.compileTemplate(template.contentTemplate, spec);
      var testFileName = templateCompiler.compileTemplate(template.fileNameTemplate, spec);
      log.log('compiled testCode:', testCode, 'testFileName', testFileName);
      downloadAs(`${testFileName}.${template.fileExtension}`, testCode);
    } catch (e) {
      //TODO: show the error to the user explicitly to help him to fix the bug in the template
      log.warn('Error while generating code. Probable template bug.', e);
      return e.toString();
    }

    return 'Test created successfully.';
  };
}
