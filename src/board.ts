/* eslint-disable no-undef */
import { convertWidgetToStepData as mapToStepData } from "./scenario-builder/board-data-mapper";
import { CSSProperties } from "react";
import { StepDataDto } from "scenario-builder/dto";
export interface IBoard {
    // eslint-disable-next-line no-unused-vars
    updateWidgetText(widgetId: string, newWidgetText: string): Promise<void>;
    // eslint-disable-next-line no-unused-vars
    getWidgetText(widgetId: string): Promise<string>
    // eslint-disable-next-line no-unused-vars
    onNextSingleSelection(succeed: (selected: SelectedWidget) => void)
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
    onWidgetLeft(updateText: (widgetId: string) => Promise<void>) {
        const select = async (selections) => {
            var widgets = selections.data;
            if (!this.previouslySelectedWidgets)
                this.previouslySelectedWidgets = widgets

            this.previouslySelectedWidgets.forEach(item => updateText(item.id))
            this.previouslySelectedWidgets = widgets
        }
        miro.addListener("SELECTION_UPDATED", select)
    }

    // eslint-disable-next-line no-unused-vars
    interceptPossibleTextEdit(updateText: (widgetId: string, updatedWidget: string) => Promise<string>) {
        const select = async (selections) => {
            var widgets = selections.data;
            if (!this.previouslySelectedWidgets) {
                this.previouslySelectedWidgets = widgets
            }
            this.previouslySelectedWidgets.forEach(async item => {
                let widget = (await miro.board.widgets.get({ id: item.id }))[0];
                const originalWidgetText = await getWidgetText(widget)
                const newText = await updateText(widget.id, originalWidgetText)
                widget = await setWidgetText(widget, newText)
                if (newText != originalWidgetText)
                    await miro.board.widgets.update([widget])
            });
            this.previouslySelectedWidgets = widgets
        }

        miro.addListener("SELECTION_UPDATED", select)
    }
    // eslint-disable-next-line no-unused-vars
    async getWidgetText(widgetId: string): Promise<string> {
        console.log("Finding widget by id:" + widgetId)
        var widget = (await miro.board.widgets.get({ id: widgetId }))[0];
        return await getWidgetText(widget)
    }
    async updateWidgetText(widgetId: string, newWidgetText: string): Promise<void> {
        let widget = (await miro.board.widgets.get({ id: widgetId }))[0];
        widget = await setWidgetText(widget, newWidgetText)
        await miro.board.widgets.update([widget])
    }
    // eslint-disable-next-line no-unused-vars
    private previousListener: (selections: any) => Promise<void>
    // eslint-disable-next-line no-unused-vars
    onNextSingleSelection(succeed: (selected: SelectedWidget) => void) {
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

            convertToDto(widget)
                .then(dto => {
                    // if (typeof dto == 'string')
                    //     console.log(dto)
                    // else {
                    console.log(dto)
                    succeed(dto)
                    miro.removeListener("SELECTION_UPDATED", select)
                    // }
                })
                .catch(console.log)
        }
        if (this.previousListener)
            miro.removeListener("SELECTION_UPDATED", this.previousListener)
        this.previousListener = select
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
    // type: string
    style: CSSProperties
    abstractionText: string
    exampleText: string
    abstractionWidget: SDK.IWidget
    exampleWidget: SDK.IWidget
}
export type SelectedWidget = {
    widgetSnapshot: ExampleWidget
    widgetData: StepDataDto
}

async function getTheStartingWidget(arrow: SDK.ILineWidget): Promise<SDK.IWidget> {
    const all = await miro.board.widgets.get({ id: arrow.startWidgetId })
    if (all.length == 0)
        await miro.showNotification("Examples should be connected to a fact they belong to.")
    return all[0]
}
async function getIncomingArrows(exampleWidget: SDK.IWidget): Promise<SDK.ILineWidget[]> {
    return (await (await miro.board.widgets.get({ type: "LINE", endWidgetId: exampleWidget.id }))
        .map(line => line as SDK.ILineWidget))
        .filter(line => line.captions.map(caption => caption.text.toLowerCase()).includes("example")
            && line.style.lineEndStyle != miro.enums.lineArrowheadStyle.NONE)
}
async function getAbstractionWidgetFor(exampleWidget: SDK.IWidget): Promise<SDK.IWidget> {
    const incomingArrows = await getIncomingArrows(exampleWidget)
    if (incomingArrows.length === 0)
        return Promise.resolve(exampleWidget)

    const widgetsPointingToThis = await Promise.all(incomingArrows.map(getTheStartingWidget))

    if (widgetsPointingToThis.length > 1) {
        const errorMessage = "Examples can not belong to more than one abstraction (only one incoming line)."
        await miro.showNotification(errorMessage)
        return Promise.reject(errorMessage)
    }

    return Promise.resolve(widgetsPointingToThis[0])

}
function getWidgetStyle(widget: SDK.IWidget): CSSProperties {
    const style = {} as CSSProperties
    if (widget["style"] && widget["style"]["backgroundColor"]) {
        console.log('Setting style:', widget["style"]["backgroundColor"])
        style.backgroundColor = widget["style"]["backgroundColor"]
    } else if (widget["style"] && widget["style"]["stickerBackgroundColor"]) {
        console.log('Setting style:', widget["style"]["stickerBackgroundColor"])
        style.backgroundColor = widget["style"]["stickerBackgroundColor"]
    }
    return style
}
async function convertToDto(widget: SDK.IWidget): Promise<SelectedWidget> {
    var dto = {
        id: widget.id,
        // type: widget.type,
        exampleWidget: widget,
    } as ExampleWidget

    dto.abstractionWidget = await getAbstractionWidgetFor(dto.exampleWidget)
    //
    console.log('Selection dto initiated.', dto)

    dto.style = getWidgetStyle(dto.abstractionWidget)
    try {
        const getPlainText = (originalText: string): string =>
            originalText.split('</p><p>').join('\n')
                .replace('<p>', '')
                .replace('</p>', '')
                .replace('&#43;', '+')

        dto.exampleText = getPlainText(await getWidgetText(widget))
        dto.abstractionText = getPlainText(await getWidgetText(dto.abstractionWidget))

    }
    catch (e) {
        return Promise.reject('The widget ' + JSON.stringify(widget) + ' does not have any text.')
    }


    console.log('Widget text converted by board:', dto.exampleText)

    try {
        var data = await mapToStepData(dto.abstractionText, dto.exampleText)
        const step = {
            widgetSnapshot: dto
            , widgetData: data
        } as SelectedWidget

        return step
    }
    catch (e) {
        miro.showNotification(e)
        return Promise.reject(e)
    }
}
function getWidgetText(widget: SDK.IWidget): Promise<string> {

    if (!widget)
        return Promise.reject("Cannot get the widget text. The widget is undefined.")

    if ("text" in widget)
        return widget["text"];

    if ("title" in widget)
        return widget["title"]

    if ("captions" in widget
        && widget["captions"]
        && widget["captions"][0]
        && widget["captions"][0]["text"])
        return Promise.resolve(widget["captions"][0]["text"])

    return Promise.reject("Cannot get the widget text. The widget has no text fields.")
}
function setWidgetText(widget: SDK.IWidget, text: string): Promise<SDK.IWidget> {
    const anyWidget = widget as any
    if ("text" in widget)
        anyWidget["text"] = text;
    else if ("title" in widget)
        anyWidget["title"] = text
    else if ("captions" in widget)
        anyWidget["captions"][0]["text"] = text
    else
        return Promise.reject("Cannot set the widget text. The widget has no text fields.")
    return Promise.resolve(anyWidget as SDK.IWidget)
}