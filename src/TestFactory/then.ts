import { testStepRecorder } from "./test-step-recorder";
import { TestStepTurn } from "./TestStepTurn";
import { globalBoard } from "../dependency-container";
import { globalStepNavigator } from "../dependency-container";

export const ThenStep = testStepRecorder({
	board: globalBoard,
	stepNavigator: globalStepNavigator,
	stepDisplayTitle: TestStepTurn.Then,
	selectionWaitingMessage: 'What should happen then?',
	turn: TestStepTurn.Then,
	// onWidgetSelection: transit(TestStepTurn.Then, TestStepTurn.Given)
})