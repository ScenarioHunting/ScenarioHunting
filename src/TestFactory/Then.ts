import { testStepRecorder, TestStepTurn } from "./TestStepRecorder";
import { globalBoard, globalStepNavigator } from "./given";

export const ThenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})