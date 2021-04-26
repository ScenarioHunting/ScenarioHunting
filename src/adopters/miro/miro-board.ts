/* eslint-disable no-undef */
import { extractStepSchema } from "../../app/scenario-builder/board-text-schema-extractor";
import { CSSProperties } from "react";
import { IBoard, SelectedStep, WidgetSnapshot } from "app/ports/iboard";
import { log } from "../../global-dependency-container";


export class MiroBoard implements IBoard {

    openModal(iframeURL: string, options?: { width?: number; height?: number } | { fullscreen: boolean }): Promise<any> {
        return miro.board.ui.openModal(iframeURL, options)
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
                const originalWidgetText = await extractWidgetText(widget)
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
        log.log("Finding widget by id:" + widgetId)
        var widget = (await miro.board.widgets.get({ id: widgetId }))[0];
        return await extractWidgetText(widget)
    }
    async updateWidgetText(widgetId: string, newWidgetText: string): Promise<void> {
        let widget = (await miro.board.widgets.get({ id: widgetId }))[0];
        widget = await setWidgetText(widget, newWidgetText)
        await miro.board.widgets.update([widget])
    }
    // eslint-disable-next-line no-unused-vars
    private previousListener: (selections: any) => Promise<void>
    // eslint-disable-next-line no-unused-vars
    onNextSingleSelection(succeed: (selected: SelectedStep) => void) {
        //TODO: Guard 
        log.log("Waiting for the next single selection!")
        const select = async (selections) => {
            var widgets = selections.data;

            if (widgets.length == 0)
                return;

            log.log("Selected.")

            if (widgets.length > 1) {
                log.log(`${widgets.length} items are selected. Only a single one can be selected.`)
                return
            }

            log.log("Getting the widget.")
            var widget = (await miro.board.widgets.get({ id: widgets[0].id }))[0];
            log.log("Converting the widget")

            extractSchemaFrom(widget)
                .then(selected => {
                    // if (typeof dto == 'string')
                    //     logger.log(dto)
                    // else {
                    log.log("Selected:", selected)
                    succeed(selected)
                    miro.removeListener("SELECTION_UPDATED", select)
                    // }
                })
                .catch(log.log)
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

    zoomTo = (widget: WidgetSnapshot) =>
        miro.board.viewport.zoomToObject(widget.id, true)

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
        log.log('Setting style:', widget["style"]["backgroundColor"])
        style.backgroundColor = widget["style"]["backgroundColor"]
    } else if (widget["style"] && widget["style"]["stickerBackgroundColor"]) {
        log.log('Setting style:', widget["style"]["stickerBackgroundColor"])
        style.backgroundColor = widget["style"]["stickerBackgroundColor"]
    }
    return style
}
async function extractSchemaFrom(exampleWidget: SDK.IWidget): Promise<SelectedStep> {
    var snapshot = {
        id: exampleWidget.id,
        // type: widget.type,
    } as WidgetSnapshot

    const abstractionWidget = await getAbstractionWidgetFor(exampleWidget)
    //
    log.log('Selection dto initiated.', snapshot)

    snapshot.style = getWidgetStyle(abstractionWidget)
    let exampleText: string
    let abstractionText: string

    try {
        const getPlainText = (originalText: string): string =>
            originalText.split('</p><p>').join('\n')
                .replace('<p>', '')
                .replace('</p>', '')
                .replace('&#43;', '+')

        exampleText = getPlainText(await extractWidgetText(exampleWidget))
        abstractionText = getPlainText(await extractWidgetText(abstractionWidget))

    }
    catch (e) {
        return Promise.reject('The widget ' + JSON.stringify(exampleWidget) + ' does not have any text.')
    }


    log.log('Widget text converted by board:', exampleText)

    try {
        const step: SelectedStep = {
            widgetSnapshot: snapshot
            , stepSchema: await extractStepSchema({
                abstractionWidgetText: abstractionText,
                exampleWidgetText: exampleText
            })
        }

        return step
    }
    catch (e) {
        console.error(e)
        return Promise.reject(e)
    }
}
function extractWidgetText(widget: SDK.IWidget): Promise<string> {

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