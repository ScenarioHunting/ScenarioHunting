import { iTemplateRepository } from "app/ports/itemplate-repository"
import { defaultTemplates } from "./default-templates"

export const setDefaultTemplatesToRepository =
    async (repository: iTemplateRepository) =>
        defaultTemplates
            .forEach(async x => await repository.createOrReplaceTemplate(x.templateName, x))
