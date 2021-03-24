/* eslint-disable no-unused-vars */
export class QueuingMachine<T> {
    constructor(private sortedTokens: T[]) {
        if (!sortedTokens || sortedTokens.length == 0) {
            console.error("No sorted tokens.");
            throw "No sorted tokens."
        }
    }
    onTurn = (token: T, whatToDo: () => void) => {
        console.log(token, 'Function registered to queue:', whatToDo)
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
