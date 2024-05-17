/* eslint-disable no-unused-vars */
import { CSSProperties } from 'react';
import { Step } from '../api';


export type WidgetSnapshot = {
    id: string
    style: CSSProperties
}
export type SelectedStep = {
    widgetSnapshot: WidgetSnapshot
    step: Step
}
export type ModalOptions<Data> = { url: string, parameters: Data }
export type ModalResult<Result> = { waitForClose: () => Promise<Result | undefined> }
export interface IBoard {
    /**
    The callback is called only once the next time that a user selects a widget
    If the user does 
    */
    onNextOneSelection(callback: (selected: SelectedStep) => void)
    unselectAll: () => Promise<void>
    showNotification: (message: string) => Promise<void>
    openModal<Data = undefined, Result = undefined>(options: ModalOptions<Data>): Promise<ModalResult<Result>>
    getModalParameters<T>(): Promise<T | undefined>
    closeModal()
    zoomTo: (widget: WidgetSnapshot) => void
}