/* eslint-disable no-unused-vars */
import { CSSProperties } from "react"
import { ObjectProperty, Step } from "../api"


export type WidgetSnapshot = {
    id: string
    style: CSSProperties
}
export type SelectedStep = {
    widgetSnapshot: WidgetSnapshot
    step: Step
}
export interface IBoard {
    updateWidgetText(widgetId: string, newWidgetText: string): Promise<void>;
    getWidgetText(widgetId: string): Promise<string>
    onNextSingleSelection(succeed: (selected: SelectedStep) => void)
    interceptPossibleTextEdit(updateText: (widgetId: string, updatedWidget: string) => Promise<string>)
    unselectAll: () => Promise<void>
    showNotification: (message: string) => Promise<void>
    openModal(iframeURL: string): Promise<any>
    closeModal()
    zoomTo: (widget: WidgetSnapshot) => void
}