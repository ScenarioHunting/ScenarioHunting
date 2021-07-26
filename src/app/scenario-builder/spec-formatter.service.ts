import { ArrayProperty, Prop, SingularProperty, Spec, Schema, Step } from "../spec";
import { stringCaseHelpers } from "../../libs/string-case-helpers";

export function specFormatterService(language: string) {

    const getTextFormatterForLanguage = (fileExtension: string) => stringCaseHelpers.snakeCase;
    const formatText = getTextFormatterForLanguage(language);

    function formatProperty(p: Prop): Prop {
        if (p.type == "array") {
            const s = p as ArrayProperty;
            return <ArrayProperty>{
                type: s.type,
                description: s.description,
                items: Array.isArray(s.items)
                    ? (s.items as Prop[]).map(formatProperty)
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
        const schema = step.schema //TODO: Consider the Low of demeter
        const result = <Schema>{
            title: formatText(schema.title),
            type: schema.type,
            properties: {}
        };
        for (let [k, v] of Object.entries(schema.properties)) {
            result.properties[k] = formatProperty(v);
        }
        return { schema: result };
    }

    return {
        formatSpec(spec: Spec): Spec {
            return {
                context: formatText(spec.context),
                subject: formatText(spec.subject),
                scenario: formatText(spec.scenario),
                given: spec.given.map(formatStep),
                when: formatStep(spec.when),
                then: spec.then.map(formatStep),
                data: spec.data,

            };
        }
    };
}
