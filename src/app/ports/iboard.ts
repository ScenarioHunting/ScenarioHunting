/* eslint-disable no-unused-vars */
import { CSSProperties } from "react"
import { Step } from "../api"


export type WidgetSnapshot = {
    id: string
    style: CSSProperties
}
export type SelectedStep = {
    widgetSnapshot: WidgetSnapshot
    step: Step
}
export interface IBoard {
    /**
    The callback is called only once the next time that a user selects a widget
    If the user does 
    */
    onNextOneSelection(callback: (selected: SelectedStep) => void)
    unselectAll: () => Promise<void>
    showNotification: (message: string) => Promise<void>
    openModal(iframeURL: string): Promise<any>
    closeModal()
    zoomTo: (widget: WidgetSnapshot) => void
}