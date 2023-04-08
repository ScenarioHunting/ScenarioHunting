
import { iLog, noLog } from "./libs/logging/log";


import { MiroBoard } from "./adopters/miro/miro-board";
import * as React from "react";
import { miroTemplateRepository } from "./adopters/miro/miro-template-repository";
import { TemplateCompiler } from "./app/template-processing/template-compiler";
import { MiroTempStorage } from "./adopters/miro/miro-temp-storage";
import { IExternalServices } from './external-services'

export const createMiroDependencies = (): IExternalServices => {
    const emptyComponent = () => <></>
    return {
        boardService: new MiroBoard(),
        boardUi: emptyComponent,
        templateRepository: new miroTemplateRepository(),
        tempSharedStorage: new MiroTempStorage(),
        templateCompiler: new TemplateCompiler(),
    }
}