import { BooleanProperty, IntegerProperty, NullProperty, NumberProperty, SingularProperty, StringProperty } from './api';

export function createSingularProperty(description: string, example: any): SingularProperty {

  if (Number.isInteger(example)) {
    return {
      type: 'integer',
      description: description,
      example: parseFloat(example)
    } as IntegerProperty;
  }
  if (!isNaN(parseFloat(example))) {
    return {
      type: 'number',
      description: description,
      example: parseFloat(example)
    } as NumberProperty;
  }
  if (['true', 'false'].includes(example.toLowerCase())) {
    return {
      type: 'boolean',
      description: description,
      example: example.toLowerCase() == 'true'
    } as BooleanProperty;
  }
  if (['null', 'nil'].includes(example.toLowerCase())) {
    return {
      type: 'null',
      description: description,
    } as NullProperty;
  }

  return {
    type: 'string',
    description: description,
    example: example
  } as StringProperty;
}