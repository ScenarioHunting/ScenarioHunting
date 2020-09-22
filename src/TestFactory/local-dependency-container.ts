import { QueuingMachine } from "./queuing-machine";
import TestRecordingConfig from "./test-recording-config";
import { ImmediateQueuingMachine } from "./immediate-queuing-machine";
import { TestStepTurn } from "./test-step-turn";

export let singletonStepNavigator = new QueuingMachine(TestRecordingConfig.stepRecordingOrder)
export let singletonImmediateStepNavigator = new ImmediateQueuingMachine<TestStepTurn>();