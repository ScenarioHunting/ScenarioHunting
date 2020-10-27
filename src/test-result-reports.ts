/* eslint-disable no-undef */
type WhenTestResultsSummeryViewModel = {
    // boardId string?
    total: number
    passed: number
    failed: number
    pending: number
    skipped: number

    example: any
}
export interface ITestResultReports {
    // eslint-disable-next-line no-unused-vars
    getTestSummeryForWidget: (widgetId: string) => Promise<WhenTestResultsSummeryViewModel | boolean>
}
export class TestResultReports implements ITestResultReports {
    getTestSummeryForWidget = async (widgetId: string): Promise<WhenTestResultsSummeryViewModel | boolean> => {
        const widget = (await miro.board.widgets.get({ id: widgetId }))[0] as SDK.IWidget
        if (!widget
            || !widget.metadata["3074457349056199734"]
            || !widget.metadata["3074457349056199734"].testSummery
            || !(widget.metadata["3074457349056199734"].testSummery as WhenTestResultsSummeryViewModel)) {
            return false
        }
        return widget.metadata["3074457349056199734"].testSummery as WhenTestResultsSummeryViewModel
    }
}