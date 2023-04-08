import { log } from '../../external-services'
import { ITempStorage } from '../../app/ports/itemp-storage'

export class LocalTempStorage implements ITempStorage {
    setItem(key: string, value: object): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value))
        log.log(`Setting ${key} to Local temp storage, value:`, value)
        return Promise.resolve()
    }
    getItem(key: string): Promise<object | null> {
        const value = localStorage.getItem(key)
        log.log(`Getting ${key} from Local temp storage, value found:`, value)
        if (!value)
            return Promise.resolve(null)
        return Promise.resolve(JSON.parse(value))
    }
    removeItem(key: string): Promise<void> {
        log.log(`Removing ${key} from Local temp storage`)
        localStorage.removeItem(key)
        return Promise.resolve()
    }

}