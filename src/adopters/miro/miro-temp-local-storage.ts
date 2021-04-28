/* eslint-disable no-undef */
import { ITempStorage } from "../../app/ports/itemp-storage";
export class MiroTempLocalStorage implements ITempStorage {
    setItem(key: string, value: object): void {
        const appId = miro.getClientId();
        const rec = {
            [appId]: {
                [key]: value
            }
        };
        (miro.board as any).metadata.update(rec).
            then(() => { })
    }
    getItem(key: string): object | null {
        return (miro.board as any).metadata.get()[key]
    }
    removeItem(key: string): void {
        const item = this.getItem(key)
        if (!item)
            return;
        delete item[key];
        (miro.board as any).metadata.update(item).
            then(() => { })
    }

}