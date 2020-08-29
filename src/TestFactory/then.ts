import { testStepRecorder, TestStepTurn } from "./test-step-recorder";
import {  globalStepNavigator } from "./given";
import { globalBoard } from "../global";

export const ThenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})