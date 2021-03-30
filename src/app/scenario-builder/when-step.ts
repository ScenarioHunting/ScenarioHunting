import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { singletonBoard } from "../../global-dependency-container";
import { queueingMachine } from "./local-dependency-container";

export let WhenStep = createTestStepRecorder({
	board: singletonBoard,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})