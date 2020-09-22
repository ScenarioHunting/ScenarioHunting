import { createTestStepRecorder } from "./test-step-recorder";
import { TestStepTurn } from "./test-step-turn";
import { globalBoard } from "../dependency-container";
import { globalStepNavigator } from "../dependency-container";

export const WhenStep = createTestStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})