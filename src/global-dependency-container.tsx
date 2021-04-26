import { IBoard } from "./app/ports/iboard";
import { iLog, noLog } from "./libs/logging/log";
import { ITestResultReports, TestResultReports } from "./test-result-reports";

import { MockBoard } from "./adopters/mocks/board-mock";

import { MiroBoard } from "./adopters/miro/miro-board";
import { UIComponent } from "./adopters/mocks/board-mock";
import * as React from "react";
import { iTemplateRepository } from "./app/ports/itemplate-repository";
import { miroTemplateRepository } from "./adopters/miro/miro-template-repository";
import { inMemoryTemplateRepository } from "./adopters/mocks/in-memory-template-repository";
import { setDefaultTemplatesToRepository } from "./app/template-processing/default-templates-initializer";




export let testResultReports: ITestResultReports = new TestResultReports()
// export let singletonBoard: IBoard = new MiroBoard()
export let log: iLog = console




interface IExternalServices {
    boardService: IBoard
    // eslint-disable-next-line no-undef
    boardUi(): JSX.Element
    templateRepository: iTemplateRepository
}



const emptyComponent = () => <></>
class miroDependencies implements IExternalServices {
    boardService = new MiroBoard()
    boardUi = emptyComponent
    templateRepository = new miroTemplateRepository()
}


class mockedDependencies implements IExternalServices {
    boardService = MockBoard()
    boardUi = UIComponent
    templateRepository = new inMemoryTemplateRepository()
}


const ExternalServices: IExternalServices = new mockedDependencies()
setDefaultTemplatesToRepository(ExternalServices.templateRepository)

export { ExternalServices }