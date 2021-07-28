import { Spec } from "../spec";

export const defaultTestSpec: Spec = {
    subject: 'Your-subject-under-test',
    context: 'Your-context',
    scenario: 'Your-scenario',
    given: [{
        schema: {
            type: "object",
            title: "Given_step_title",
            properties: {
                string_sample: {
                    type: "string",
                    description: "string sample",
                    example: "str example"
                },
                number_sample: {
                    type: "number",
                    description: "num sample",
                    example: 23
                },
            }
        }
    }],
    when: {
        schema: {
            type: "object",
            title: "When_step_title",
            properties: {
                bool_sample: {
                    type: "boolean",
                    description: "boolean sample",
                    example: false
                },
                array_sample: {
                    type: "array",
                    description: "array_sample",
                    items: {
                        type: "string",
                        description: "1st array item",
                        example: "1st array item example"
                    }
                },
            }
        }
    },
    then: [{
        schema: {
            type: "object",
            title: "Then_step_title",
            properties: {
                tuple_sample: {
                    type: "array",
                    description: "array_sample",
                    items: [
                        {
                            type: "string",
                            description: "1st tuple item",
                            example: "1st tuple item"
                        },
                        {
                            type: "number",
                            description: "2nd tuple item",
                            example: 2
                        }
                    ]
                }
            }
        }
    }],
    data: [
        {
            given: [{
                string_sample: "string data",
                number_sample: 2000,
            }],
            when: {
                bool_sample: true,
                array_sample: [
                    "1st item",
                    "2nd item"
                ],
            },
            then: [{
                tuple_sample: [
                    "str",
                    12
                ],
            }]
        },
    ]
}