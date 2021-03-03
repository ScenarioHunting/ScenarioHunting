import { TestStepTurn } from "./test-step-turn";
import { singletonBoard } from "../global-dependency-container";
import { createTestStepRecorder } from "./test-step-recorder";
// import { singletonImmediateStepNavigator } from "./local-dependency-container";

export let GivenStep = createTestStepRecorder({
    board: singletonBoard,
    // stepNavigator: singletonImmediateStepNavigator,

    stepType: '',
    selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
    turn: TestStepTurn.Given,
});