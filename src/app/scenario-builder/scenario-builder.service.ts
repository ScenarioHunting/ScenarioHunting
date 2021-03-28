/* eslint-disable no-undef */
import { IndexedStep } from "./given-collection.component"
import { CreateTestDto, IndexedStepDataDto, StepDataDto } from "./dto"
import { SelectedWidget } from "board"
import { getTemplateRepository } from "../template-processing/template-repository"
import { isNullOrUndefined } from "./isNullOrUndefined"
import { compileTemplate } from "../template-processing/template-compiler"
import { logger } from "libs/logging/console"

const toDto = ({ testContext
    , testName
    , sutName

    , givens
    , when
    , then }: LocalTestCreationResult): CreateTestDto => {

    return {
        context: testContext,
        testName: testName,
        test: {
            givens: givens.map(indexedStep => {
                return {
                    step: indexedStep.step.widgetData,
                    // step: {
                    //     type: indexedStep.step.data.type,
                    //     properties: indexedStep.step.data.properties.map(p => p as StepDataPropertyDto)
                    // },
                    index: indexedStep.index
                } as IndexedStepDataDto
            }),
            when: when.widgetData,
            thens: [{ step: then.widgetData, index: 0 } as IndexedStepDataDto],
            sut: sutName,
        },
        metadata: {
            contents: JSON.stringify({
                given: givens.map(given => { given.step.widgetSnapshot, given.index }),
                when: when.widgetSnapshot,
                then: [{ step: then.widgetSnapshot, index: 0 }]
            })
        }
    }
}

export type LocalTestCreationResult = {
    testContext: string
    , testName: string
    , sutName: string

    , givens: IndexedStep[]
    , when: SelectedWidget
    , then: SelectedWidget
}
function saveAs(fileName: string, data: string) {
    logger.log(`Saving as: file Name: ${fileName} content: ${JSON.stringify(data)}`)
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    if (isNullOrUndefined(window.navigator.msSaveOrOpenBlob)) {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
    else {
        window.navigator.msSaveBlob(blob, fileName);
    }
}
export async function Save(templateName: string, test: LocalTestCreationResult): Promise<string> {
    const dto = toDto(test)
    var viewModel = dtoToJsonSchema(dto)
    logger.log("Saving the template for test:", viewModel.scenario)
    try {

        var testTemplateRepository = await getTemplateRepository()
        var template = await testTemplateRepository.getTemplateByName(templateName)
        logger.log("template loaded:", templateName)
    }
    catch (e) {
        logger.log("An error occurred while loading the template:", e)
        return e.toString()
    }

    try {
        var testCode = compileTemplate(template.contentTemplate, viewModel)
        var testFileName = compileTemplate(template.fileNameTemplate, viewModel)
        logger.log("compiled testCode:", testCode, "testFileName", testFileName)
        saveAs(`${testFileName}.${template.fileExtension}`, testCode)
    } catch (e) {
        //TODO: show the error to the user explicitly to help him to fix the bug in the template
        logger.error("Error while generating code. Probable template bug.", e)
        return e.toString()
    }

    return 'Test created successfully.'


}

function dtoToJsonSchema(dto: CreateTestDto) {
    function stepToJsonSchema(step: StepDataDto) {
        var props = {}
        step.properties.forEach(p => {
            props[p.propertyName] = {
                type: "string",
                description: p.propertyName,
                example: p.simplePropertyValue
            }
        })
        return {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: step.type,
            type: "object",
            properties: props
        }
    }
    return {
        givens: dto.test.givens.map(given => stepToJsonSchema(given.step)),
        when: stepToJsonSchema(dto.test.when),
        thens: dto.test.thens.map(then => stepToJsonSchema(then.step)),
        sut: dto.test.sut,
        context: dto.context,
        scenario: dto.testName,
    }
}