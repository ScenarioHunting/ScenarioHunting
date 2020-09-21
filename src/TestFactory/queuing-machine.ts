/* eslint-disable no-unused-vars */
export interface IQueuingMachine<T> {
    onTurn(_: T, whatToDo: () => void)
    start(): void
    nextTurn(): void
}

export class QueuingMachine<T> {
    constructor(private sortedTokens: T[]) { }
    onTurn = (token: T, whatToDo: () => void) => {
        console.log(token, 'registered, func:', whatToDo)
        this.tasks[this.sortedTokens.indexOf(token)] = whatToDo;
        // if(this.tasks.length == this.sortedTokens.length){
        //     this.start()
        // }
    }
    nextTurn = () => {
        console.log('Remaining tasks:', this.tasks)
        console.log('Shifting.')
        this.tasks.shift()!();
    }
    start = () => this.nextTurn();
    private tasks: (() => void)[] = [];
}
