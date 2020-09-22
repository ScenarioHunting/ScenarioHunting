import { TestStepTurn } from "./test-step-turn";
import { singletonBoard } from "../dependency-container";
import { createTestStepRecorder } from "./test-step-recorder";

class ImmediateQueuingMachine<T>{
    onTurn = (_: T, whatToDo: () => void) => whatToDo()
    start = () => { }
    nextTurn = () => { }
}
let immediateQueuingMachine = new ImmediateQueuingMachine<TestStepTurn>();


export const GivenStep = createTestStepRecorder({
    board: singletonBoard,
    stepNavigator: immediateQueuingMachine,

    stepType: '',
    selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
    turn: TestStepTurn.Given,
});