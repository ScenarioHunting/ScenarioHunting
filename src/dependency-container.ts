import { Board, IBoard } from "./board";
import { QueuingMachine } from "./TestFactory/queuing-machine";
import TestRecordingConfig from "./TestFactory/test-recording-config";


export let globalStepNavigator = new QueuingMachine(TestRecordingConfig.stepRecordingOrder)
export let globalBoard: IBoard = new Board()