import { IBoard } from "./app/ports/iboard";
// eslint-disable-next-line no-unused-vars
import { iLog, noLog } from "./libs/logging/log";
import { ITestResultReports, TestResultReports } from "./test-result-reports";

import { MockBoard } from "./adopters/mocks/board-mock";

import { MiroBoard } from "./adopters/miro/miro-board";
import { UIComponent } from "./adopters/mocks/board-mock";
import * as React from "react";
import { ITemplateRepository as ITemplateRepository } from "./app/ports/itemplate-repository";
import { miroTemplateRepository } from "./adopters/miro/miro-template-repository";
import { localStorageTemplateRepository } from "./adopters/mocks/local-storage-template-repository";
import { decorateRepositoryWithTemplates } from "./app/template-processing/default-template-repository-decorator";
import { ITempStorage } from "./app/ports/itemp-storage";
import { LocalTempStorage } from "./adopters/mocks/local-temp-storage";
import { TemplateCompiler } from "./app/template-processing/template-compiler";
import { MiroTempStorage } from "./adopters/miro/miro-temp-storage";
import { defaultTemplates } from "./app/template-processing/default-templates";




export let testResultReports: ITestResultReports = new TestResultReports()
// export let singletonBoard: IBoard = new MiroBoard()
export let log: iLog = console

export interface IExternalServices {
    readonly boardService: IBoard
    // eslint-disable-next-line no-undef
    boardUi(): JSX.Element

    readonly templateRepository: ITemplateRepository
    readonly tempSharedStorage: ITempStorage
    readonly templateCompiler: TemplateCompiler
}

// eslint-disable-next-line no-unused-vars 
const createMiroDependencies = (): IExternalServices => {
    const emptyComponent = () => <></>
    return {
        boardService: new MiroBoard(),
        boardUi: emptyComponent,
        templateRepository: decorateRepositoryWithTemplates(new miroTemplateRepository(), defaultTemplates),
        tempSharedStorage: new MiroTempStorage(),
        templateCompiler: new TemplateCompiler(),
    } as const
}

const createMockedDependencies = (): IExternalServices => {
    return {
        boardService: MockBoard(),
        boardUi: UIComponent,
        templateRepository: decorateRepositoryWithTemplates(new localStorageTemplateRepository(), defaultTemplates),
        tempSharedStorage: new LocalTempStorage(),
        templateCompiler: new TemplateCompiler(),
    } as const
}

//const ExternalServices = createMiroDependencies()
 const ExternalServices = createMiroDependencies()

export { ExternalServices }
