/* eslint-disable no-undef */
import { isNullOrUndefined } from "../../libs/isNullOrUndefined"
import { compileTemplate } from "../template-processing/template-compiler"
import { spec } from "app/spec";
import { ExternalServices, log } from "../../global-dependency-container";
const templateRepository = ExternalServices.templateRepository

function downloadAs(fileName: string, data: string) {
    log.log(`Saving as: file Name: ${fileName} content: ${JSON.stringify(data)}`)
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
export class ScenarioBuilderService {
    static Save = async (templateName: string, viewModel: spec): Promise<string> => {
        log.log("Saving the template for test:", viewModel.scenario)

        try {
            var template = await templateRepository.getTemplateByName(templateName)
            log.log("template loaded:", templateName)
        }
        catch (e) {
            log.log("An error occurred while loading the template:", e)
            return e.toString()
        }

        try {
            var testCode = compileTemplate(template.contentTemplate, viewModel)
            var testFileName = compileTemplate(template.fileNameTemplate, viewModel)
            log.log("compiled testCode:", testCode, "testFileName", testFileName)
            downloadAs(`${testFileName}.${template.fileExtension}`, testCode)
        } catch (e) {
            //TODO: show the error to the user explicitly to help him to fix the bug in the template
            log.error("Error while generating code. Probable template bug.", e)
            return e.toString()
        }

        return 'Test created successfully.'
    }
}
