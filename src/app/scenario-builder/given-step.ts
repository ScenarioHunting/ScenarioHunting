import { TestStepTurn } from './step-picker/scenario-step-turn';
import { ExternalServices } from '../../external-services';
import { createTestStepRecorder } from './step-picker/scenario-step-picker.component';
import { immediateQueuingMachine } from './local-dependency-container';

export let GivenStep = createTestStepRecorder({
  board: ExternalServices.boardService,
  stepNavigator: immediateQueuingMachine,

  stepType: '',
  selectionWaitingMessage: 'Select minimum required steps for the when to end up then.',
  turn: TestStepTurn.Given,
});