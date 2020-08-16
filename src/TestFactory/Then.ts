import { testStep, TestStepTurn } from "./testStep";
import { globalBoard, globalStepNavigator } from "./Given";

export const ThenStep = testStep({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})