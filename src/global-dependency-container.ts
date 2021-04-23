import { IBoard } from "./app/iboard";
import { iLog } from "./libs/logging/log";
import { ITestResultReports, TestResultReports } from "./test-result-reports";
// import { MockBoard } from "./board-mock";
// export let singletonBoard: IBoard = MockBoard()

import { MiroBoard } from "./miro-board";
export let singletonBoard: IBoard = new MiroBoard()

export let testResultReports: ITestResultReports = new TestResultReports()
export let log: iLog = console