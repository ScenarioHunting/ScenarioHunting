import { IQueuingMachine } from "./iqueuing-machine";

/* eslint-disable no-unused-vars */
export class QueuingMachine<T extends string> implements IQueuingMachine<T>{
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
        //TODO: defence
        console.log('Remaining tasks:', this.tasks)
        if (!this.sortedTokens.includes(token))
            return
        console.log('Shifting.')

        const nextIndex = this.sortedTokens.indexOf(token) + 1
        const nextToken = this.sortedTokens[nextIndex]
        const task = this.tasks[nextToken]
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
