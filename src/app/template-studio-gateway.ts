import { Api } from './api';
import { ExternalServices, log } from '../external-services';
import { scenarioExample } from './scenario-builder/scenario-example';

const boardService = ExternalServices.boardService
const templateRepository = ExternalServices.templateRepository

export type TemplateStudioParameters = { templateName?: string, scenario?: Api }

export async function openTemplateStudio({ templateName = undefined, scenario = undefined }: TemplateStudioParameters) {
    const template = await templateRepository.getTemplateByName(templateName ?? 'new')
    
    if (!template) {
        const message = `The template named ${templateName} does not exist.`
        throw Error(message)
    }

    const parameters = {
        template,
        data: scenario ?? scenarioExample
    }

    log.log("Opening template studio.")
    log.log({ templateName, parameters, templateList: await templateRepository.getAllTemplateNames() })

    return boardService.openModal({
        url: './template-studio.html',
        parameters
    })
}