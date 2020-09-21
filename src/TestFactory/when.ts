import { testStepRecorder } from "./test-step-recorder";
import { TestStepTurn } from "./TestStepTurn";
import { globalBoard } from "../dependency-container";
import { globalStepNavigator } from "../dependency-container";

export const WhenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})