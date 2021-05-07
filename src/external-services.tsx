import { IBoard } from "./app/ports/iboard";
// eslint-disable-next-line no-unused-vars
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
import { LocalTempStorage } from "./adopters/mocks/local-temp-storage";
import { TemplateCompiler } from "./app/template-processing/template-compiler";
import { MiroTempStorage } from "./adopters/miro/miro-temp-storage";




export let testResultReports: ITestResultReports = new TestResultReports()
// export let singletonBoard: IBoard = new MiroBoard()
export let log: iLog = console

export interface IExternalServices {
    boardService: IBoard
    // eslint-disable-next-line no-undef
    boardUi(): JSX.Element
    templateRepository: ITemplateRepository
    tempSharedStorage: ITempStorage
    templateCompiler: TemplateCompiler
}

// eslint-disable-next-line no-unused-vars 
const createMiroDependencies = (): IExternalServices => {
    const emptyComponent = () => <></>
    return {
        boardService: new MiroBoard(),
        boardUi: emptyComponent,
        templateRepository: new miroTemplateRepository(),
        tempSharedStorage: new MiroTempStorage(),
        templateCompiler: new TemplateCompiler(),
    }
}

const createMockedDependencies = (): IExternalServices => {
    return {
        boardService: MockBoard(),
        boardUi: UIComponent,
        templateRepository: new localStorageTemplateRepository(),
        tempSharedStorage: new LocalTempStorage(),
        templateCompiler: new TemplateCompiler(),
    }
}

const ExternalServices = createMiroDependencies()
setDefaultTemplatesToRepository(ExternalServices.templateRepository)

export { ExternalServices }