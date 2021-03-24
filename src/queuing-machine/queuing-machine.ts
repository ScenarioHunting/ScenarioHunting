/* eslint-disable no-unused-vars */
export class QueuingMachine<T extends string> {
    constructor(private sortedTokens: T[]) {
        if (!sortedTokens || sortedTokens.length == 0) {
            console.error("No sorted tokens.");
            throw "No sorted tokens."
        }
    }
    onTurn = (token: T, whatToDo: () => void) => {
        console.log(token, 'Function registered to queue:', whatToDo)
        this.tasks[token] = whatToDo;
    }
    done = (token: T) => {
        console.log('Remaining tasks:', this.tasks)
        console.log('Shifting.')
        //TODO: defence
        var task = this.tasks[this.sortedTokens[this.sortedTokens.indexOf(token) + 1]]
        if (task) {
            task()
            delete this.tasks[token]
        }
        // this.tasks.shift()!();
    }
    start = () => {
        this.tasks[this.sortedTokens[0]]()
    }
    private tasks: { [token: string]: (() => void) } = {};
}
