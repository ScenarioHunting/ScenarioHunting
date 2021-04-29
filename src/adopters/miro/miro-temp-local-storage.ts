/* eslint-disable no-undef */
import { ITempStorage } from "../../app/ports/itemp-storage";
export class MiroTempLocalStorage implements ITempStorage {
    async setItem(key: string, value: object): Promise<void> {
        const appId = miro.getClientId();
        const rec = {
            [appId]: {
                [key]: value
            }
        };
        await (miro.board as any).metadata.update(rec)
    }
    private waitUntil = (condition) => {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve: (value: any) => void) => {
            let interval = setInterval(() => {
                if (!condition()) {
                    return
                }

                clearInterval(interval)
                resolve(null)
            }, 100)
        })
    }
    async getItem(key: string): Promise<object | null> {
        await this.waitUntil(() => miro.board)
        return (await (miro.board as any).metadata.get())[key]
    }
    async removeItem(key: string): Promise<void> {
        const item = this.getItem(key)
        if (!item)
            return;
        delete item[key];
        await (miro.board as any).metadata.update(item)
    }

}