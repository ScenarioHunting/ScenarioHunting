import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { queueingMachine } from "./local-dependency-container";
import { ExternalServices } from "../../global-dependency-container";
const boardService = ExternalServices.boardService
export let WhenStep = createTestStepRecorder({
	board: boardService,
	stepNavigator: queueingMachine,
	stepType: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})