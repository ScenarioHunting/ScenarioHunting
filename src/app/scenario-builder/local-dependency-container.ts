import { QueuingMachine } from '../../libs/queuing-machine/queuing-machine';
import TestRecordingConfig from './scenario-builder-config';
import { ImmediateQueuingMachine } from '../../libs/queuing-machine/immediate-queuing-machine';
import { TestStepTurn } from './step-picker/scenario-step-turn';

export let queueingMachine = new QueuingMachine(TestRecordingConfig.stepRecordingOrder);
export let immediateQueuingMachine = new ImmediateQueuingMachine<TestStepTurn>();