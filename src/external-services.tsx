import { IBoard } from "./app/ports/iboard";
import { iLog, noLog } from "./libs/logging/log";
import { ITestResultReports, TestResultReports } from "./test-result-reports";

import { MockBoard } from "./adopters/mocks/board-mock";

import { MiroBoard } from "./adopters/miro/miro-board";
import { UIComponent } from "./adopters/mocks/board-mock";
import * as React from "react";
import { iTemplateRepository as ITemplateRepository } from "./app/ports/itemplate-repository";
import { miroTemplateRepository } from "./adopters/miro/miro-template-repository";
import { localStorageTemplateRepository } from "./adopters/mocks/local-storage-template-repository";
import { setDefaultTemplatesToRepository } from "./app/template-processing/default-templates-initializer";
import { ITempStorage } from "./app/ports/itemp-storage";
import { TempLocalStorage } from "./adopters/mocks/temp-local-storage";




export let testResultReports: ITestResultReports = new TestResultReports()
// export let singletonBoard: IBoard = new MiroBoard()
export let log: iLog = console




interface IExternalServices {
    boardService: IBoard
    // eslint-disable-next-line no-undef
    boardUi(): JSX.Element
    templateRepository: ITemplateRepository
    tempSharedStorage: ITempStorage
}



const emptyComponent = () => <></>
class miroDependencies implements IExternalServices {
    boardService = new MiroBoard()
    boardUi = emptyComponent
    templateRepository = new miroTemplateRepository()
    tempSharedStorage = new TempLocalStorage()
}

class mockedDependencies implements IExternalServices {
    boardService = MockBoard()
    boardUi = UIComponent
    templateRepository = new localStorageTemplateRepository()
    tempSharedStorage = new TempLocalStorage()
}


// let  ExternalServices: IExternalServices

// // ExternalServices = new miroDependencies()
// ExternalServices = new mockedDependencies()

export const ExternalServices = new mockedDependencies()
setDefaultTemplatesToRepository(ExternalServices.templateRepository)

// export { ExternalServices }