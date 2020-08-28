import { testStepRecorder, TestStepTurn } from "./TestStepRecorder";
import { globalBoard, globalStepNavigator } from "./given";

export const WhenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.When,
	selectionWaitingMessage: 'Select the exercise you want to test.',
	turn: TestStepTurn.When,
	// onWidgetSelection: transit(TestStepTurn.When, TestStepTurn.Then)
})