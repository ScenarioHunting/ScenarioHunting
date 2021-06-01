import { ArrayProperty, Prop, SingularProperty, Spec, StepSchema } from "../spec";
import { stringCaseHelpers } from "../../libs/string-case-helpers";

export function specFormatterService(language: string) {

    const getTextFormatterForLanguage = (fileExtension: string) => stringCaseHelpers.toSnakeCase;
    const formatText = getTextFormatterForLanguage(language);

    function formatProperty(p: Prop): Prop {
        if (p.type == "array") {
            const s = p as ArrayProperty;
            return <ArrayProperty>{
                type: s.type,
                description: s.description,
                items: s.items.map(formatProperty),
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
    function formatStep(s: StepSchema) {
        const result = <StepSchema>{
            $schema: s.$schema,
            title: formatText(s.title),
            type: s.type,
            properties: {}
        };
        for (let [k, v] of Object.entries(s.properties)) {
            result.properties[k] = formatProperty(v);
        }
        return result;
    }

    return {
        formatSpec(spec: Spec): Spec {
            return <Spec>{
                context: formatText(spec.context),
                subject: formatText(spec.subject),
                scenario: formatText(spec.scenario),
                given: spec.given.map(formatStep),
                when: formatStep(spec.when),
                then: spec.then.map(formatStep)
            };
        }
    };
}
