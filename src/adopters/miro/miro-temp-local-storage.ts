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
        miro.board.metadata.update(rec).
            then(() => { })
    }
    getItem(key: string): object | null {
        return miro.board.metadata.get()[key]
    }
    removeItem(key: string): void {
        miro.board.metadata.update(delete miro.board.metadata.get()[key]).
            then(() => { })
    }

}