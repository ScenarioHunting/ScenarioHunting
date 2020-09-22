/* eslint-disable no-unused-vars */
export interface IQueuingMachine<T> {
    onTurn(_: T, whatToDo: () => void);
    start(): void;
    nextTurn(): void;
}
