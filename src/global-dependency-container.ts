import { Board, IBoard } from "./board";
import { ITestResultReports, TestResultReports } from "./test-result-reports";

export let singletonBoard: IBoard = new Board()
export let testResultReports: ITestResultReports = new TestResultReports()