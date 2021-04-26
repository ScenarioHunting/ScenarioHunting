import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { queueingMachine } from "./local-dependency-container";
import { ExternalServices } from "../../global-dependency-container";

export let ThenStep = createTestStepRecorder({
	board: ExternalServices.boardService,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
})