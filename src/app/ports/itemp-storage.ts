/* eslint-disable no-unused-vars */
export interface ITempStorage {
    setItem(key: string, value: object): void;
    getItem(key: string): object | null;
    removeItem(key: string): void;
}