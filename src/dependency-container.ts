import { Board, IBoard } from "./board";
import { QueuingMachine } from "./TestFactory/queuing-machine";
import TestRecordingConfig from "./TestFactory/test-recording-config";


export let singletonStepNavigator = new QueuingMachine(TestRecordingConfig.stepRecordingOrder)
export let singletonBoard: IBoard = new Board()