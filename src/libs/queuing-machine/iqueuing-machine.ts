export interface IQueuingMachine<T> {
    onTurn(_: T, _whatToDo: () => void)
    start(): void
    done(_: T): void
}
