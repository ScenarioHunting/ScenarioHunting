
export class Board {

    onNextSingleSelection(succeed: (selected:Widget) => void) {
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

    unselectAll = () => miro.board.selection.clear()

    showNotification = (message: string) =>
        miro.showNotification(message)

    static async captureSingleItemSelections(widgets, succeed, fail) {
    }
}
export type Widget = {
    id: string
    type: string
    text: string
    x: number
    y: number
}
function convertToDto(widget: SDK.IWidget): Widget | string {
    var dto = {
        id: widget.id,
        type: widget.type,
    } as Widget
    console.log('Selection dto initiated.', dto)

    //TODO: Refactor this:
    if ("x" in widget && "y" in widget) {
        dto.x = widget["x"]
        dto.y = widget["y"]
    }
    else
        return 'The widget ' + JSON.stringify(widget) + ' is does not have x, and y.'

    if ("plainText" in widget)
        dto.text = widget["plainText"]
    else if ("text" in widget) dto.text = widget["text"];
    else if ("captions" in widget)
        dto.text = widget["captions"][0]["text"]
    else
        return 'The widget ' + JSON.stringify(widget) + ' is does not have any text.'
    return dto
}