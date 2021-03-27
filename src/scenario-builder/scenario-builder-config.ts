import { TestStepTurn } from "./step-picker/scenario-step-turn";

export default new class TestRecordingConfig {
    stepRecordingOrder = [
        TestStepTurn.Then,
        TestStepTurn.When,
        TestStepTurn.Subject,
        TestStepTurn.Context,
        TestStepTurn.Scenario,
        TestStepTurn.Given,
    ]
    // stepRecordingOrder = [TestStepTurn.When, TestStepTurn.Then, TestStepTurn.Given];
}

