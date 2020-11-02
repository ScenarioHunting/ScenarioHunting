/* eslint-disable no-undef */
import { CSSProperties } from "react";
import { resolve } from "path";
export interface IBoard {
    // eslint-disable-next-line no-unused-vars
    onNextSingleSelection(succeed: (selected: ExampleWidget) => void)
    // eslint-disable-next-line no-unused-vars
    interceptPossibleTextEdit(updateText: (widgetId: string, updatedWidget: string) => Promise<string>)
    unselectAll: () => Promise<void>
    // eslint-disable-next-line no-unused-vars
    showNotification: (message: string) => Promise<void>
    // eslint-disable-next-line no-unused-vars
    zoomTo: (widget: ExampleWidget) => any
}
export class Board implements IBoard {
    openModal(modalAddress: string) {
        miro.board.ui.openModal(modalAddress, { width: 50, height: 50 })
        throw new Error("Method not implemented.");
    }
    private previouslySelectedWidgets: SDK.IWidget[]
    // eslint-disable-next-line no-unused-vars
    interceptPossibleTextEdit(updateText: (widgetId: string, updatedWidget: string) => Promise<string>) {
        const select = async (selections) => {
            var widgets = selections.data;
            if (!this.previouslySelectedWidgets) {
                this.previouslySelectedWidgets = widgets
            }
            this.previouslySelectedWidgets.forEach(async item => {
                var widget = (await miro.board.widgets.get({ id: item.id }))[0];
                const originalWidgetText = getWidgetText(widget)
                if (typeof originalWidgetText != 'boolean') {
                    const newText = await updateText(widget.id, originalWidgetText)
                    if (newText != originalWidgetText
                        && setWidgetText(widget, newText))
                        await miro.board.widgets.update([widget])
                }
            });
            this.previouslySelectedWidgets = widgets
        }

        miro.addListener("SELECTION_UPDATED", select)
    }

    // eslint-disable-next-line no-unused-vars
    onNextSingleSelection(succeed: (selected: ExampleWidget) => void) {
        //TODO: Guard 
        console.log("Waiting for the next single selection!")
        const select = async (selections) => {
            var widgets = selections.data;

            if (widgets.length == 0)
                return;

            console.log("Selected.")

            if (widgets.length > 1) {
                console.log(`${widgets.length} items are selected. Only a single one can be selected.`)
                return
            }

            console.log("Getting the widget.")
            var widget = (await miro.board.widgets.get({ id: widgets[0].id }))[0];
            console.log("Converting the widget")

            const dto = convertToDto(widget)
            if (typeof dto == 'string')
                console.log(dto)
            else {
                console.log(dto)
                succeed(dto)
                miro.removeListener("SELECTION_UPDATED", select)
            }
        }
        return miro.addListener("SELECTION_UPDATED", select)
    }

    unselectAll = async () => {
        if (!miro || !miro.board)
            await new Promise(resolve => setTimeout(resolve, 200))
        await miro.board.selection.clear()
    }

    showNotification = (message: string) =>
        miro.showNotification(message)

    zoomTo = (widget: ExampleWidget) =>
        miro.board.viewport.zoomToObject(widget.id, true)

    // static async captureSingleItemSelections(widgets, succeed, fail) {
    //     // miro.board.widgets.sel
    // }
}
export type ExampleWidget = {
    id: string
    fact: string
    type: string
    text: string
    x: number
    y: number
    style: CSSProperties
}
// export type FactWidget = {
//     id: string
//     type: string
//     text: string
//     x: number
//     y: number
//     style: CSSProperties
// }
async function convertToDto(widget: SDK.IWidget): Promise<ExampleWidget | string> {
    var dto = {
        id: widget.id,
        type: widget.type,

    } as ExampleWidget

    //TODO: clean this up:
    const incomingArrows = (await miro.board.widgets.get({ type: "LINE", endWidgetId: widget.id }) as SDK.ILineWidget[])
        .filter(line => line.style.lineEndStyle != 0)
    if (incomingArrows.length == 0) {
        dto.fact = dto.id
    }
    else {
        const getTheStartingWidget = async (arrow: SDK.ILineWidget): Promise<SDK.IWidget> => {
            const all = await miro.board.widgets.get({ id: arrow.startWidgetId })
            if (all.length == 0)
                await miro.showNotification("Examples should be connected to a fact they belong to.")
            return all[0]
        }
        const widgetsPointingToThis = await Promise.all(incomingArrows.map(getTheStartingWidget))

        if (widgetsPointingToThis.length > 1) {
            await miro.showNotification("Examples should not have more than one incoming line.")
            return ""
        }

        dto.fact = widgetsPointingToThis[0].id
    }
    //
    console.log('Selection dto initiated.', dto)

    //TODO: Refactor this:
    if ("x" in widget && "y" in widget) {
        dto.x = widget["x"]
        dto.y = widget["y"]
    }
    else
        return 'The widget ' + JSON.stringify(widget) + ' is does not have x, and y.'

    dto.style = {} as CSSProperties
    if (widget["style"] && widget["style"]["backgroundColor"]) {
        console.log('Setting style:', widget["style"]["backgroundColor"])
        dto.style.backgroundColor = widget["style"]["backgroundColor"]
    } else if (widget["style"] && widget["style"]["stickerBackgroundColor"]) {
        console.log('Setting style:', widget["style"]["stickerBackgroundColor"])
        dto.style.backgroundColor = widget["style"]["stickerBackgroundColor"]

    }
    // if ("plainText" in widget)
    //     dto.text = widget["plainText"]
    // else 
    const widgetText = getWidgetText(widget)
    if (typeof widgetText == 'boolean') {
        if (!widgetText)
            return 'The widget ' + JSON.stringify(widget) + ' does not have any text.'
    } else
        dto.text = widgetText

    dto.text = dto.text
        .split('</p><p>').join('\n')
        .replace('<p>', '')
        .replace('</p>', '')
        .replace('&#43;', '+')
    console.log('Widget text converted by board.:', dto.text)


    dto.id

    return dto
}
function getWidgetText(widget: SDK.IWidget): string | boolean {
    if ("text" in widget)
        return widget["text"];
    else if ("captions" in widget
        && widget["captions"]
        && widget["captions"][0]
        && widget["captions"][0]["text"])
        return widget["captions"][0]["text"]
    else
        return false
}
function setWidgetText(widget: SDK.IWidget, text: string): SDK.IWidget | boolean {
    const anyWidget = widget as any
    if ("text" in widget)
        anyWidget["text"] = text;
    else if ("captions" in widget)
        anyWidget["captions"][0]["text"] = text
    else
        return false
    return anyWidget as SDK.IWidget
}