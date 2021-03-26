import { createTestStepRecorder } from "./test-step-picker";
import { TestStepTurn } from "./test-step-turn";
import { singletonBoard } from "../global-dependency-container";
import { singletonStepNavigator } from "./local-dependency-container";

export let WhenStep = createTestStepRecorder({
	board: singletonBoard,
	stepNavigator: singletonStepNavigator,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})