export interface IQueuingMachine<T> {
    onTurn(_: T, whatToDo: () => void)
    start(): void
    nextTurn(): void
}

export class QueuingMachine<T> {
    constructor(private sortedTokens: T[]) { }
    onTurn = (token: T, whatToDo: () => void) => this.tasks[this.sortedTokens.indexOf(token)] = whatToDo;
    nextTurn = () => this.tasks.shift()!();
    start = () => this.nextTurn();
    private tasks: (() => void)[] = [];
}
