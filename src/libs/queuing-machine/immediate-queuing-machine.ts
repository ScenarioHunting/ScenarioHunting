import { IQueuingMachine } from "./iqueuing-machine";

export class ImmediateQueuingMachine<T> implements IQueuingMachine<T>{
    onTurn = (_: T, whatToDo: () => void) => whatToDo();
    start = () => { };
    done = () => { };
}
