import { IBoard } from './app/ports/iboard';
// eslint-disable-next-line no-unused-vars
import { iLog, noLog } from './libs/logging/log';

import { MockBoard } from './adopters/mocks/board-mock';

import { MiroBoard } from './adopters/miro/miro-board';
import { UIComponent } from './adopters/mocks/board-mock';
import * as React from 'react';
import { ITemplateRepository as ITemplateRepository } from './app/ports/itemplate-repository';
import { miroTemplateRepository } from './adopters/miro/miro-template-repository';
import { localStorageTemplateRepository } from './adopters/mocks/local-storage-template-repository';
import { decorateRepositoryWithTemplates } from './app/template-processing/default-template-repository-decorator';
import { TemplateCompiler } from './app/template-processing/template-compiler';
import { builtinTemplates } from './app/template-processing/builtin-templates';




// export let singletonBoard: IBoard = new MiroBoard()
export let log: iLog = noLog;

export interface IExternalServices {
    readonly boardService: IBoard
    boardUi(): JSX.Element

    readonly templateRepository: ITemplateRepository
    readonly templateCompiler: TemplateCompiler
}

// eslint-disable-next-line no-unused-vars 
const createMiroDependencies = (): IExternalServices => {
  const emptyComponent = () => <></>;
  return {
    boardService: new MiroBoard(),
    boardUi: emptyComponent,
    templateRepository: decorateRepositoryWithTemplates(new miroTemplateRepository(), builtinTemplates),
    templateCompiler: new TemplateCompiler(),
  } as const;
};

// eslint-disable-next-line no-unused-vars
const createMockedDependencies = (): IExternalServices => {
  return {        
    boardService: MockBoard(),
    boardUi: UIComponent,
    templateRepository: decorateRepositoryWithTemplates(new localStorageTemplateRepository(), builtinTemplates),
    templateCompiler: new TemplateCompiler(),
  } as const;
};


const ExternalServices = createMiroDependencies();


export { ExternalServices };
