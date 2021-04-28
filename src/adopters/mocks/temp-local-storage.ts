import { ITempStorage } from '../../app/ports/itemp-storage'
export class TempLocalStorage implements ITempStorage {
    setItem(key: string, value: object): void {
        localStorage.setItem(key, JSON.stringify(value))
    }
    getItem(key: string): object | null {
        const item = localStorage.getItem(key)
        if (!item)
            return null
        return JSON.parse(item)
    }
    removeItem(key: string): void {
        localStorage.removeItem(key)
    }

}