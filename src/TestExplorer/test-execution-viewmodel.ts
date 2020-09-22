export interface TestExecutionStatus {
    message?: any;
    status: string;
}

export interface TestExecutionViewModel {
    testName: string;
    result: TestExecutionStatus;
}