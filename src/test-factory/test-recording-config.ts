import { TestStepTurn } from "./test-step-turn";

export default new class TestRecordingConfig {
    stepRecordingOrder = [TestStepTurn.Then, TestStepTurn.When, TestStepTurn.Given];
    // stepRecordingOrder = [TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given];
}

