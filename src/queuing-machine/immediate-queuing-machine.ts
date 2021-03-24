export class ImmediateQueuingMachine<T> {
    onTurn = (_: T, whatToDo: () => void) => whatToDo();
    start = () => { };
    done = () => { };
}
