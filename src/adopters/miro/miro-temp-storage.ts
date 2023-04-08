/* eslint-disable no-undef */
import { ITempStorage } from "../../app/ports/itemp-storage";
import { log } from "../../external-services";

const VALUE = "storage.-value"

export class MiroTempStorage implements ITempStorage {
    // private KEY = "storage.-id"
    // constructor(private keyPostfix: string = '') {
    //     this.KEY = KEY + '+' + keyPostfix
    // }
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
    private getStorageId(): string {
        return "storage.-id" + miro.currentUser.getId()
    }
    private async getAllStorageWidgets() {
        await this.waitUntil(() => miro.board)
        return ((await miro.board.widgets.get())
            .filter(i => i.type == 'TEXT'
                && i.metadata && i.metadata[miro.getClientId()]
                && i.metadata[miro.getClientId()]
                && i.metadata[miro.getClientId()][this.getStorageId()]) as SDK.ITextWidget[])
    }
    private async getAll() {
        return (await this.getAllStorageWidgets())
            .map(i => i.metadata[miro.getClientId()])
    }

    private async addItem(key: string, value: object): Promise<void> {
        var widgets = await this.getAllStorageWidgets()
        var x: number;
        var y: number;
        if (widgets.length > 0) {
            const firstWidget = widgets[0]
            x = firstWidget.x
            y = firstWidget.y
        } else {
            const viewport = await miro.board.viewport.get()
            x = viewport.x - 200
            y = viewport.y - 200
        }
        const kv = { [this.getStorageId()]: key, [VALUE]: value }
        await miro.board.widgets.create({
            type: "TEXT",
            text: JSON.stringify(kv),
            metadata: {
                [miro.getClientId()]: kv
            },
            capabilities: {
                editable: false
            },
            style: {
                textAlign: "l"
            },
            x: x,
            y: y,
            clientVisible: false
        })
    }

    async setItem(key: string, value: object): Promise<void> {
        if (await this.getItem(key))
            await this.removeItem(key)
        return await this.addItem(key, value)
    }
    async getItem(key: string): Promise<object | null> {
        const all = await this.getAll()
        const kv = all.find(i => i[this.getStorageId()] == key)
        if (!kv)
            return null;
        return kv[VALUE]
    }
    async removeItem(key: string): Promise<void> {
        const allWidgets = await this.getAllStorageWidgets()
        const widgetsToRemove = await allWidgets.filter(w =>
            w.metadata[miro.getClientId()][this.getStorageId()] == key)
        log.log('Removing storage:', key)
        log.log('widgetsToRemove:', widgetsToRemove)
        widgetsToRemove.forEach(async widget => {
            log.log("Removing temp storage widget with id: ", widget.id)
            await miro.board.widgets.deleteById(widget.id)
        })
    }
}
//     async setItem(key: string, value: object): Promise<void> {
//         const appId = miro.getClientId();
//         const rec = {
//             [appId]: {
//                 [this.getStorageKey()]: value
//             }
//         };
//         await (miro.board as any).metadata.update(JSON.stringify(rec))
//     }
//     private waitUntil = (condition) => {
//         // eslint-disable-next-line no-unused-vars
//         return new Promise((resolve: (value: any) => void) => {
//             let interval = setInterval(() => {
//                 if (!condition()) {
//                     return
//                 }

//                 clearInterval(interval)
//                 resolve(null)
//             }, 100)
//         })
//     }
//     async getItem(key: string): Promise<object | null> {
//         await this.waitUntil(() => miro.board)
//         return (await (miro.board as any).metadata.get())[this.getStorageKey()]
//     }
//     async removeItem(key: string): Promise<void> {
//         const item = this.getItem(key)
//         if (!item)
//             return;
//         delete item[this.getStorageKey()];
//         await (miro.board as any).metadata.update(JSON.stringify(item))
//     }

// }