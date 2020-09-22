import { createTestStepRecorder } from "./test-step-recorder";
import { TestStepTurn } from "./test-step-turn";
import { singletonBoard } from "../dependency-container";
import { singletonStepNavigator } from "../dependency-container";

export const WhenStep = createTestStepRecorder({
	board: singletonBoard,
	stepNavigator: singletonStepNavigator,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})