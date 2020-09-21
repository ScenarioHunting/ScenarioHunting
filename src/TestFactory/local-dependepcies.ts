import { QueuingMachine } from "./queuing-machine";
import { TestStepTurn } from "./TestStepTurn";

export let globalStepNavigator = new QueuingMachine([TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given])
