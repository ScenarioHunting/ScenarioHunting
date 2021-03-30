import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { singletonBoard } from "../../global-dependency-container";
import { queueingMachine } from "./local-dependency-container";

export let ThenStep = createTestStepRecorder({
	board: singletonBoard,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})