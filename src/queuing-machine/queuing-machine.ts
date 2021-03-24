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
    done = (token: T) => {
        console.log('Remaining tasks:', this.tasks)
        console.log('Shifting.')
        //TODO: defence
        var task = this.tasks[this.sortedTokens.indexOf(token)+1]
        // var f = this.tasks.find(task)
        if (task) {
            task()
            const index = this.tasks.indexOf(task, 0)
            this.tasks.splice(index, 1)
        }
        // this.tasks.shift()!();
    }
    start = () => this.tasks.shift()!();
    private tasks: (() => void)[] = [];
}
