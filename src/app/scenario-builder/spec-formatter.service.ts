import { arrayProperty, prop, singularProperty, spec, stepSchema } from "../spec";
import { stringCaseHelpers } from "../../libs/string-case-helpers";

export function specFormatterService(language: string) {

    const getTextFormatterForLanguage = (fileExtension: string) => stringCaseHelpers.toSnakeCase;
    const formatText = getTextFormatterForLanguage(language);

    function formatProperty(p: prop): prop {
        if (p.type == "array") {
            const s = p as arrayProperty;
            return <arrayProperty>{
                type: s.type,
                description: s.description,
                items: s.items.map(formatProperty),
            };
        } else {
            const s = (p as singularProperty);
            return <singularProperty>{
                type: s.type,
                description: s.description,
                example: s.example,
            };
        }
    }
    function formatStep(s: stepSchema) {
        const result = <stepSchema>{
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
        formatSpec(spec: spec): spec {
            return <spec>{
                context: formatText(spec.context),
                sut: formatText(spec.sut),
                scenario: formatText(spec.scenario),
                givens: spec.givens.map(formatStep),
                when: formatStep(spec.when),
                thens: spec.thens.map(formatStep)
            };
        }
    };
}
