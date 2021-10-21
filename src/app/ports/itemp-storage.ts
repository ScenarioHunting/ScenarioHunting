/* eslint-disable no-unused-vars */
export interface ITempStorage {
    setItem(key: string, value: object): Promise<void>
    getItem(key: string): Promise<object | null>
    removeItem(key: string): Promise<void>
}