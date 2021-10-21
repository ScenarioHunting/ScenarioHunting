import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { queueingMachine } from "./local-dependency-container";
import { ExternalServices } from "../../external-services";

export let ThenStep = createTestStepRecorder({
	board: ExternalServices.boardService,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.Then,
	selectionWaitingMessage: 'Select post conditions.',
	turn: TestStepTurn.Then,
})