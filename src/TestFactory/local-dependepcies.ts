import { QueuingMachine } from "./queuing-machine";
import { TestStepTurn } from "./test-step-turn";

export let globalStepNavigator = new QueuingMachine([TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given])
