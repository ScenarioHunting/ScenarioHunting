import { IBoard } from "./app/iboard";
import { iLog } from "./libs/logging/log";
import { Board } from "./miro-board";
import { ITestResultReports, TestResultReports } from "./test-result-reports";

export let singletonBoard: IBoard = new Board()
export let testResultReports: ITestResultReports = new TestResultReports()
export let log: iLog = console