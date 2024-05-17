import { Api, ObjectProperty } from '../api';

export const scenarioExample: Api = {
  version: '1.0.0',
  subject: {
    title: 'Your-subject-under-test',
  },
  context: {
    title: 'Your-context',
  },
  scenario: {
    title: 'Your-scenario',
  },
  given: [{
    title: 'Given_step_title',
    schema: {
      type: 'object',
      properties: {
        string_sample: {
          type: 'string',
          description: 'string sample',
          example: 'str example'
        },
        number_sample: {
          type: 'number',
          description: 'num sample',
          example: 23
        },
      }
    },
    example: {}
  }],
  when: {
    title: 'When_step_title',
    schema: {
      type: 'object',
      properties: {
        bool_sample: {
          type: 'boolean',
          description: 'boolean sample',
          example: false
        },
        array_sample: {
          type: 'array',
          description: 'array_sample',
          items: {
            type: 'string',
            description: '1st array item',
            example: '1st array item example'
          }
        },
      }
    },
    example: {}
  },
  then: [{
    title: 'Then_step_title',
    schema: {
      type: 'object',
      properties: {
        tuple_sample: {
          type: 'array',
          description: 'array_sample',
          items: [
            {
              type: 'string',
              description: '1st tuple item',
              example: '1st tuple item'
            },
            {
              type: 'number',
              description: '2nd tuple item',
              example: 2
            }
          ]
        }
      },
      description: '',
    } as ObjectProperty,
    example: {}
  }],
  // data: [
  //     {
  //         given: [{
  //             string_sample: "string data",
  //             number_sample: 2000,
  //         }],
  //         when: {
  //             bool_sample: true,
  //             array_sample: [
  //                 "1st item",
  //                 "2nd item"
  //             ],
  //         },
  //         then: [{
  //             tuple_sample: [
  //                 "str",
  //                 12
  //             ],
  //         }]
  //     },
  // ]
};