import { ITempStorage } from '../../app/ports/itemp-storage'
export class TempLocalStorage implements ITempStorage {
    setItem(key: string, value: object): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value))
        return Promise.resolve()
    }
    getItem(key: string): Promise<object | null> {
        const item = localStorage.getItem(key)
        if (!item)
            return Promise.resolve(null)
        return JSON.parse(item)
    }
    removeItem(key: string): Promise<void> {
        localStorage.removeItem(key)
        return Promise.resolve()
    }

}