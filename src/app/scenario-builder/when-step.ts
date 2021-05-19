import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { queueingMachine } from "./local-dependency-container";
import { ExternalServices } from "../../external-services";

export let WhenStep = createTestStepRecorder({
	board: ExternalServices.boardService,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'What does trigger the action?',
	turn: TestStepTurn.When,
})