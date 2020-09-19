import { testStepRecorder, TestStepTurn } from "./test-step-recorder";
import {  globalStepNavigator } from "./given";
import { globalBoard } from "../global";

export const WhenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})