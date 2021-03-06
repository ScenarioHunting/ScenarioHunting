// /* eslint-disable no-undef */
// // eslint-disable-next-line no-unused-vars
// const should = require('chai').should()
// import { localStorageTemplateRepository } from "./local-storage-template-repository";

// describe('How it creates and restores templates', function () {
//     const templateRepository = new localStorageTemplateRepository()
//     const sampleTemplate = {
//         templateName: "sample-template",
//         fileNameTemplate: "{{scenario.title}}",
//         fileExtension: "cs",
//         contentTemplate: `code body`
//     }
//     beforeEach(() =>
//         templateRepository.createOrReplaceTemplate('whatever', sampleTemplate)
//     )
//     it(`contains the newly created template's name`, async function () {
//         const templateNames = await templateRepository.getAllTemplateNames()
//         templateNames.should.contain(sampleTemplate.templateName)
//     })
//     it(`remembers the newly created template`, async function () {
//         const template = await templateRepository.getTemplateByName(sampleTemplate.templateName)
//         template.should.eq(sampleTemplate)
//     })
//     it('removes the newly created template', async () => {
//         templateRepository.removeTemplate(sampleTemplate.templateName)
//         const templateNames = await templateRepository.getAllTemplateNames()
//         templateNames.should.not.contain(sampleTemplate.templateName)
//     })
//     it('updates the newly created template', async () => {
//         const expected = {
//             templateName: "updated-template",
//             fileNameTemplate: "{{scenario.title}}",
//             fileExtension: "cs",
//             contentTemplate: `new code body`
//         }


//         templateRepository.createOrReplaceTemplate(sampleTemplate.templateName, expected);


//         (await templateRepository.getAllTemplateNames())
//         .should.not.contain(sampleTemplate.templateName)

//         const actual = await templateRepository.getTemplateByName(expected.templateName)
//         actual.should.eq(expected)

//     })
// })
