import { CSSProperties } from "react"

export type ExampleWidget = {
    id: string
    // type: string
    style: CSSProperties
    abstractionText: string
    exampleText: string
    abstractionWidget: any
    exampleWidget: any
}
type StepDataPropertyDto = {
    propertyName: string
    simplePropertyValue: string
}
export type StepDataDto = {
    type: string
    properties: StepDataPropertyDto[]
}
export type SelectedWidget = {
    widgetSnapshot: ExampleWidget
    widgetData: StepDataDto
}
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