/* eslint-disable no-undef */
class WhenTestResultsSummeryViewModel {
    // boardId string?
    total: number
    passed: number
    failed: number
    pending: number
    skipped: number

    // example: any
}
class WhenTestReportViewModel {
    // boardId string?
    passed: string[]
    failed: string[]
    pending: string[]
    skipped: string[]
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
            || !widget.metadata["3074457349056199734"].testReport
            || !(widget.metadata["3074457349056199734"].testReport as WhenTestReportViewModel)) {
            return false
        }
        const report = widget.metadata["3074457349056199734"].testReport as WhenTestReportViewModel
        const result: WhenTestResultsSummeryViewModel = {
            total: report.passed?.length ?? 0 + report.failed?.length ?? 0 + report.pending?.length ?? 0 + report.skipped?.length ?? 0,
            passed: report.passed?.length ?? 0,
            failed: report.failed?.length ?? 0,
            skipped: report.skipped?.length ?? 0,
            pending: report.pending?.length ?? 0,
            // example: widget.metadata["3074457349056199734"].testSummery.example
        }
        return result
        // if (!widget
        //     || !widget.metadata["3074457349056199734"]
        //     || !widget.metadata["3074457349056199734"].testSummery
        //     || !(widget.metadata["3074457349056199734"].testSummery as WhenTestResultsSummeryViewModel)) {
        //     return false
        // }
        // return widget.metadata["3074457349056199734"].testSummery as WhenTestResultsSummeryViewModel
    }
}