import { ArrayProperty, AbstractProperty, SingularProperty, Api, ObjectProperty, Step } from '../api';
import { stringCaseHelpers } from '../../libs/string-case-helpers';

export function specFormatterService(language: string) {

  const buildTextFormatterForLanguage = (fileExtension: string) => {
    switch (fileExtension) {
    case 'cs':
      return stringCaseHelpers.pascalCase;
    case 'yml':
    case 'json':
      return stringCaseHelpers.snakeCase;
    case 'js':
    case 'ts':
      return stringCaseHelpers.camelCase;
    default:
      return x => x;
    }
  };
  const formatText = buildTextFormatterForLanguage(language);

  function formatProperty(p: AbstractProperty): AbstractProperty {
    if (p.type == 'array') {
      const s = p as ArrayProperty;
      return <ArrayProperty>{
        type: s.type,
        description: s.description,
        items: Array.isArray(s.items)
          ? (s.items as AbstractProperty[]).map(formatProperty)
          : formatProperty(s.items),
      };
    } else {
      const s = (p as SingularProperty);
      return <SingularProperty>{
        type: s.type,
        description: s.description,
        example: s.example,
      };
    }
  }
  function formatStep(step: Step): Step {
    const schema = step.schema; //TODO: Consider the Low of demeter
    const result = <ObjectProperty>{
      type: schema.type,
      properties: {}
    };
    for (let [k, v] of Object.entries(schema.properties)) {
      result.properties[k] = formatProperty(v);
    }
    return {
      schema: result,
      title: formatText(step.title),
      example: step.example
    };
  }

  return {
    formatSpec(spec: Api): Api {
      return {
        version: '1.0.0',
        context: { title: formatText(spec.context.title) },
        subject: { title: formatText(spec.subject.title) },
        scenario: formatText(spec.scenario),
        given: spec.given.map(formatStep),
        when: formatStep(spec.when),
        then: spec.then.map(formatStep),
        // data: spec.data,
      };
    }
  };
}
