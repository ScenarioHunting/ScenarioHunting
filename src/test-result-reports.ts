/* eslint-disable no-undef */
export class WhenTestResultsSummeryViewModel {
    // boardId string?
    total: number
    passed: number
    failed: number
    pending: number
    skipped: number
}
export class WhenTestReportViewModel {
    // boardId string?
    passed: string[]
    failed: string[]
    pending: string[]
    skipped: string[]
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
            || !widget.metadata[miro.getClientId()]
            || !widget.metadata[miro.getClientId()].testReport
            || !(widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel)) {
            return false
        }
        const report = widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel
        // const result: WhenTestResultsSummeryViewModel = {
        //     total: (report.passed ?? []).length + (report.failed ?? []).length + (report.pending ?? []).length + (report.skipped ?? []).length,
        //     passed: (report.passed ?? []).length,
        //     failed: (report.failed ?? []).length,
        //     skipped: (report.skipped ?? []).length,
        //     pending: (report.pending ?? []).length,
        //     // example: widget.metadata[miro.getClientId()].testSummery.example
        // }
        return TestReportToSummery(report)
        // if (!widget
        //     || !widget.metadata[miro.getClientId()]
        //     || !widget.metadata[miro.getClientId()].testReport
        //     || !(widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel)
        //     || !((widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel).summery)) {
        //     return false
        // }
        // return widget.metadata[miro.getClientId()].testSummery as WhenTestResultsSummeryViewModel
    }
}
export function TestReportToSummery(report: WhenTestReportViewModel): WhenTestResultsSummeryViewModel {
    const result: WhenTestResultsSummeryViewModel = {
        total: (report.passed ?? []).length + (report.failed ?? []).length + (report.pending ?? []).length + (report.skipped ?? []).length,
        passed: (report.passed ?? []).length,
        failed: (report.failed ?? []).length,
        skipped: (report.skipped ?? []).length,
        pending: (report.pending ?? []).length,
        // example: widget.metadata[miro.getClientId()].testSummery.example
    }
    return result
}
