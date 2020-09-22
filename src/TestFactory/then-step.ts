import { createTestStepRecorder } from "./test-step-recorder";
import { TestStepTurn } from "./test-step-turn";
import { singletonBoard } from "../dependency-container";
import { singletonStepNavigator } from "../dependency-container";

export const ThenStep = createTestStepRecorder({
	board: singletonBoard,
	stepNavigator: singletonStepNavigator,
	stepType: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})