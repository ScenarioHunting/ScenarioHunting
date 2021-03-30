import { TestStepTurn } from "./step-picker/scenario-step-turn";
import { singletonBoard } from "../../global-dependency-container";
import { createTestStepRecorder } from "./step-picker/scenario-step-picker.component";
import { immediateQueuingMachine } from "./local-dependency-container";

export let GivenStep = createTestStepRecorder({
    board: singletonBoard,
    stepNavigator: immediateQueuingMachine,

    stepType: '',
    selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
    turn: TestStepTurn.Given,
});