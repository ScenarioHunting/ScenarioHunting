/* eslint-disable no-undef */
import { IndexedStep } from "./given-collection"
import { CreateTestDto, IndexedStepDataDto, StepDataDto } from "./dto"
import { SelectedWidget } from "board"
import Handlebars from "handlebars/dist/handlebars.js"
import { isNullOrUndefined } from "util"
import { getTemplateRepository } from "./templateRepository"

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
// export async function Save(templateName: string, test: LocalTestCreationResult): Promise<string> {
export async function Save(templateName: string, test: LocalTestCreationResult, onSuccess, onError): Promise<void> {
    try {
        console.log("Save: TemplateName:", templateName)
        const dto = toDto(test)


        var testTemplateRepository = getTemplateRepository()
        var restoredTemplate = await testTemplateRepository.getTemplateContentByName(templateName)
        var result = await generateTestCode(restoredTemplate, dtoToJsonSchema(dto))
        saveAs(result.testName, result.testCode)

        var requestBody = JSON.stringify(dto);
        const response = await fetch('http://localhost:6000/Tests',//TODO: read it from config file
            {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: requestBody
            });
        if (response.ok)
            // return 'Test created successfully.'
            onSuccess()
        else
            // return response.statusText
            onError(response.statusText)
    }
    catch (error) {
        // return error.toString()
        onError(error)
    }

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
        sut: dto.testName,
        context: dto.context,
        testName: dto.testName,
    }
}
//********************** */

async function generateTestCode(restoredTemplate, testSchema): Promise<{ testName: string, testCode: string }> {

    Handlebars.registerHelper('skipLast', function (options) {
        if (options.data.last) {
            return options.inverse()
        } else {
            return options.fn()
        }
    })


    var compiledTemplate = Handlebars.compile(restoredTemplate);

    //TODO: validate: the test must have When and Then at least.
    var testCode = compiledTemplate(testSchema)
    return { testName: testSchema.testName, testCode: testCode }
}
