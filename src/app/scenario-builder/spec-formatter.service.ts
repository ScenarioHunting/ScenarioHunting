import { ArrayProperty, Prop, SingularProperty, Spec, Step, Schema } from "../spec";
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
    function formatStep(s: Step) {
        const data = <Schema>{
            title: formatText(s.data.title),//TODO: Consider the Low of demeter
            type: s.data.type,//TODO: Consider the Low of demeter
            properties: {}
        };
        for (let [k, v] of Object.entries(s.data.properties)) {
            data.properties[k] = formatProperty(v);
        }
        return <Step>{ data: data };
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
