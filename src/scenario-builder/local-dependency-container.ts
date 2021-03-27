import { QueuingMachine } from "../queuing-machine/queuing-machine";
import TestRecordingConfig from "./scenario-builder-config";
import { ImmediateQueuingMachine } from "../queuing-machine/immediate-queuing-machine";
import { TestStepTurn } from "./step-picker/scenario-step-turn";

export let singletonStepNavigator = new QueuingMachine(TestRecordingConfig.stepRecordingOrder)
export let singletonImmediateStepNavigator = new ImmediateQueuingMachine<TestStepTurn>();