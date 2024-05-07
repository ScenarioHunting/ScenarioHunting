/* eslint-disable no-undef */
import { extractStepFromText } from "../../app/scenario-builder/board-text-schema-extractor";
import { CSSProperties } from "react";
import { IBoard, SelectedStep, WidgetSnapshot } from "../../app/ports/iboard";
import { log } from "../../external-services";
import { Connector, Item, NotificationType } from "@mirohq/websdk-types";


export class MiroBoard implements IBoard {

    openModal(iframeURL: string): Promise<any> {
        return miro.board.ui.openModal({ url: iframeURL, fullscreen: true })
    }
    closeModal() { miro.board.ui.closeModal() }

    private previouslySelectedWidgets: Item[]

    // eslint-disable-next-line no-unused-vars
    onWidgetLeft(updateText: (widgetId: string) => Promise<void>) {
        const select = async (selections) => {
            var widgets = selections.data;
            if (!this.previouslySelectedWidgets)
                this.previouslySelectedWidgets = widgets

            this.previouslySelectedWidgets.forEach(item => updateText(item.id))
            this.previouslySelectedWidgets = widgets
        }
        miro.board.events.on("SELECTION_UPDATED", select)
    }

    // eslint-disable-next-line no-unused-vars
    private previousListener: (selections: any) => Promise<void>
    // eslint-disable-next-line no-unused-vars
    onNextOneSelection(succeed: (selected: SelectedStep) => void) {
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
            var widget = (await miro.board.get({ id: widgets[0].id }))[0];
            log.log("Converting the widget")

            extractStepFrom(widget)
                .then(selected => {
                    // if (typeof dto == 'string')
                    //     logger.log(dto)
                    // else {
                    log.log("Selected:", selected)
                    succeed(selected)
                    miro.board.events.on("SELECTION_UPDATED", select)
                    // }
                })
                .catch(log.log)
        }
        if (this.previousListener)
            miro.board.events.off("SELECTION_UPDATED", this.previousListener)
        this.previousListener = select
        return miro.board.events.on("SELECTION_UPDATED", select)
    }

    unselectAll = async () => {
        if (!miro || !miro.board)
            await new Promise(resolve => setTimeout(resolve, 200))
        await miro.board.deselect()
    }

    showNotification = (message: string) =>
        miro.board.notifications.show({ type: NotificationType.Info, message})

    zoomTo = async (widget: WidgetSnapshot) =>
        miro.board.viewport.zoomTo(await miro.board.get({id: widget.id}))

}


async function getTheStartingWidget(arrow: Connector): Promise<Item> {
    const all = await miro.board.get({ id: arrow.start?.item??"" })
    if (all.length == 0)
        await miro.board.notifications.show({ type: NotificationType.Info, message: "Examples should be connected to a fact they belong to."})
    return all[0]
}
async function getIncomingArrows(exampleWidget: Item): Promise<Connector[]> {
    return (await (await miro.board.get({ type: "LINE", endWidgetId: exampleWidget.id }))
        .map(line => line as Connector))
        .filter(line => line.captions?.map(caption => caption.content?.toLowerCase()).includes("example")
            && line.style.endStrokeCap != 'none')
}
async function getAbstractionWidgetFor(exampleWidget: Item): Promise<Item> {
    const incomingArrows = await getIncomingArrows(exampleWidget)
    if (incomingArrows.length === 0)
        return Promise.resolve(exampleWidget)

    const widgetsPointingToThis = await Promise.all(incomingArrows.map(getTheStartingWidget))

    if (widgetsPointingToThis.length > 1) {
        const errorMessage = "Examples can not belong to more than one abstraction (only one incoming line)."
        await miro.board.notifications.show({type:NotificationType.Error,message:errorMessage})
        return Promise.reject(errorMessage)
    }

    return Promise.resolve(widgetsPointingToThis[0])

}
function getWidgetStyle(widget: Item): CSSProperties {
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
async function extractStepFrom(exampleWidget: Item):Promise<SelectedStep> {
    var snapshot = {
        id: exampleWidget.id,
        // type: widget.type,
    } as WidgetSnapshot

    const schemaWidget = await getAbstractionWidgetFor(exampleWidget)
    //
    log.log('Selection dto initiated.', snapshot)

    snapshot.style = getWidgetStyle(schemaWidget)
    let exampleText: string
    let schemaText: string

    try {
        const getPlainText = (originalText: string): string =>
            originalText.split('</p><p>').join('\n')
                .replace('&#43;', '+')
                .replace(/(<([^>]+)>)/ig, '')

        exampleText = getPlainText(await extractWidgetText(exampleWidget))
        schemaText = getPlainText(await extractWidgetText(schemaWidget))

    }
    catch (e) {
        return Promise.reject('The widget ' + JSON.stringify(exampleWidget) + ' does not have any text.')
    }


    log.log('Widget text converted by board:', exampleText)

    try {
        const s = await extractStepFromText({
            schemaText: schemaText,
            exampleText: exampleText
        });
        log.log('The step extracted from text:', s)
        const step: SelectedStep = {
            widgetSnapshot: snapshot
            , step: s
        }

        return step
    }
    catch (e) {
        log.error(e)
        return Promise.reject(e)
    }
}
function extractWidgetText(widget: Item): Promise<string> {

    if (!widget)
        return Promise.reject("Cannot get the widget text. The widget is undefined.")

    if ("text" in widget)
        return Promise.resolve(widget["text"] as string);

    if ("title" in widget)
        return Promise.resolve(widget["title"])

    if ("captions" in widget
        && widget["captions"]
        && widget["captions"][0]
        && widget["captions"][0]["text"])
        return Promise.resolve(widget["captions"][0]["text"])

    return Promise.reject("Cannot get the widget text. The widget has no text fields.")
}
function setWidgetText(widget: Item, text: string): Promise<Item> {
    const anyWidget = widget as any
    if ("text" in widget)
        anyWidget["text"] = text;
    else if ("title" in widget)
        anyWidget["title"] = text
    else if ("captions" in widget)
        anyWidget["captions"][0]["text"] = text
    else
        return Promise.reject("Cannot set the widget text. The widget has no text fields.")
    return Promise.resolve(anyWidget as Item)
}