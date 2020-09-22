import { TestStepTurn } from "./test-step-turn";

export default new class TestRecordingConfig {
    stepRecordingOrder = [TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given];
}

