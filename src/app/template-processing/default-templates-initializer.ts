import { iTemplateRepository } from "../../app/ports/itemplate-repository"
import { textTemplate } from '../ports/itemplate-repository'
export const setDefaultTemplatesToRepository =
    (repository: iTemplateRepository, readonlyTemplates: textTemplate[]) => {
        readonlyTemplates
            .forEach(async t => await repository.createOrReplaceTemplate(t.templateName, t))
        return repository
    }

