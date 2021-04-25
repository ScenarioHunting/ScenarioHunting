import { iTemplateRepository, textTemplate } from "app/ports/itemplate-repository"
import { defaultTemplates } from "../app/template-processing/default-templates"
import { miroTemplateRepository } from "./miro/miro-template-repository"
import { inMemoryTemplateRepository } from "./mocks/in-memory-template-repository"

async function addSamplesToRepository(repository: iTemplateRepository) {
    const sampleTemplates: textTemplate[] = defaultTemplates
    for (var i = 0; i < sampleTemplates.length; i++) {
        await repository.createOrReplaceTemplate(sampleTemplates[i].templateName, sampleTemplates[i])
    }
    // sampleTemplates.forEach(async x => await repository.createOrReplaceTemplate(x))
}

export async function getTemplateRepository(): Promise<iTemplateRepository> {
    var singletonInstance = new miroTemplateRepository()
    // var singletonInstance = new inMemoryTemplateRepository()
    await addSamplesToRepository(singletonInstance)
    return singletonInstance
}

// export async function createOrUpdateSampleTemplates() {
//     var singletonInstance = await getTemplateRepository()
//     await addSamplesToRepository(singletonInstance)
// }