/* eslint-disable no-undef */



interface EditorSuggestion {
    label: string;
    detail?: string;
    insertText: string;
    children?: EditorSuggestion[];
}

const mapSuggestion = (suggestion: EditorSuggestion) => {
    const hasChildren = suggestion.children?.length;
    return {
        label: suggestion.label,
        kind: monaco.languages.CompletionItemKind.Field,
        detail: suggestion.detail,
        insertText: suggestion.insertText,
        ...(hasChildren ? {//Drop down the suggest
            command: {
                id: 'editor.action.triggerSuggest'
            }
        } : {}),
        range: null as any
    } as monaco.languages.CompletionItem;
};
function splitLast(text: string, separators: string[]) {
    let result = text;
    separators.forEach(sep => {
        const parts = result.split(sep)
        result = parts[parts.length - 1]
    })
    return result
}


const isPositionBetweenPositions = (left: monaco.Position | undefined, mid: monaco.IPosition, right: monaco.Position | undefined): boolean =>
    (left && left.isBefore(mid)
        && (!right
            || right.isBeforeOrEqual(left)
            || !right.isBeforeOrEqual(mid)))
    ?? false

/**
 * Checks if the mid position is in the block of left, and right like: {{|}}
 * @param left example: {{
 * @param right example: }}
 */
const isPositionBetween = (left: string, position: monaco.IPosition, right: string, model: monaco.editor.ITextModel, isRegex: boolean = false): boolean =>
    isPositionBetweenPositions(
        model.findPreviousMatch(left, position, isRegex, false, null, false)?.range?.getStartPosition(),
        position,
        model.findPreviousMatch(right, position, isRegex, false, null, false)?.range?.getEndPosition())

function filterSuggestionsFor(
    allSuggestions: EditorSuggestion[],
    phrase: string,
    separator: string
): EditorSuggestion[] {
    if (phrase.startsWith(separator))
        return []

    if (phrase.length === 0)
        return allSuggestions

    const wordChain = phrase.split(separator).filter(s => s !== '');

    if (!wordChain.length)
        return allSuggestions.filter(s => s.insertText.includes(phrase))

    let currentLevel = allSuggestions;
    let matchedSuggestion: EditorSuggestion | undefined
    // let hasSubSuggestions: boolean
    for (let i = 0; i < wordChain.length; i++) {
        let leftMostWord = wordChain[i]
        matchedSuggestion = currentLevel.find(c => c.insertText === leftMostWord);
        // hasSubSuggestions = (matchedSuggestion?.children?.length ?? 0) > 0

        if (matchedSuggestion?.children)
            currentLevel = matchedSuggestion?.children;
    }


    if (matchedSuggestion?.children)
        return currentLevel

    if (phrase.endsWith(separator))
        return []

    if (matchedSuggestion)
        return currentLevel.filter(s => s.insertText.includes(phrase))

    return currentLevel
}

const getPhraseBetween = (start: monaco.IPosition | undefined
    , end: monaco.IPosition | undefined
    , separator: string
    , model: monaco.editor.ITextModel): string => {
    if (!start || !end)
        return ""

    return splitLast(model.getValueInRange({
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
    }), [' ', '\n'].filter(x => x != separator)).trim()
}

const buildSuggestions = (
    blockStart: string,
    allSuggestions: EditorSuggestion[],
    blockEnd: string,
    separator: string,

    currentPosition: monaco.IPosition,
    model: monaco.editor.ITextModel): monaco.languages.CompletionItem[] => {



    if (!isPositionBetween(blockStart, currentPosition, blockEnd, model))
        return []

    let currentPhrase = getPhraseBetween(
        model.findPreviousMatch(blockStart, currentPosition, false, false, null, false)?.range?.getEndPosition(),
        currentPosition,
        separator,
        model)


    const results = filterSuggestionsFor(allSuggestions, currentPhrase, separator).map(mapSuggestion)

    return results
}

///////////////////////////////////////////////////////////////////////
const propertySuggestions: EditorSuggestion[] = [
    {
        label: "type",
        insertText: "type",
    },
    {
        label: "description",
        insertText: "description",
    },
    {
        label: "example",
        insertText: "example",
    },
]

const stepSchemaSuggestions: EditorSuggestion[] = [
    {
        label: "title",
        insertText: "title",
        detail: "Step title (type of the step in it's context)"
    },
    {
        label: "type",
        insertText: "type",
        detail: "The type of the step from json schema specification"
    },
    {
        label: "properties",
        insertText: "properties",
        detail: "Step properties",
        children: [{
            label: "first",
            insertText: "[0]",
            children: propertySuggestions,
        }],
    },

]

const specSuggestions: EditorSuggestion[] = [
    {
        label: "context",
        insertText: "context",
        detail: "The Bounded context of the scenario"
    },
    {
        label: "subject",
        insertText: "subject",
        detail: "The name of the subject (system under test)"
    },
    {
        label: "scenario",
        insertText: "scenario",
        detail: "The name of the scenario"
    },
    {
        label: "when",
        insertText: "when",
        detail: "when step",
        children: stepSchemaSuggestions,
    },
    //Collections:
    {
        label: "given",//given.+\}(\r\n|\r|\n)+.+\{\{
        insertText: "given",
        detail: "given steps",
        children: [{
            label: "first",
            insertText: "[0]",
            children: stepSchemaSuggestions,
        }]
    },
    {
        label: "then",//then.+\}(\r\n|\r|\n)+.+\{\{
        insertText: "then",
        detail: "then steps",
        children: [{
            label: "first",
            insertText: "[0]",
            children: stepSchemaSuggestions,
        }]
    },
    //collections:

    // //Collection Items
    {
        label: "step",//\{\{#each.*given\sas\s\|step\|\}\}(\r\n|\r|\n)+.+\{\{
        insertText: "step",
        detail: "A scenario step",
        children: stepSchemaSuggestions
    },
    {
        label: "property",
        insertText: "property",
        detail: "Step property",
        children: propertySuggestions,
    },
]

//////////////////////////////

let disposables: monaco.IDisposable[] = []
export const applyIntellisense = (language: string) => {
    disposables.forEach(z => z.dispose())
    let disposable = monaco.languages.registerCompletionItemProvider(
        language,
        {
            triggerCharacters: ['{', '.', ' '],
            provideCompletionItems: (model, position) => {
                return {
                    suggestions:
                        buildSuggestions('{{',
                            specSuggestions,
                            '}}',
                            ".",
                            position,
                            model)
                } as monaco.languages.ProviderResult<monaco.languages.CompletionList>;
            }
        }
    );
    disposables.push(disposable)

    disposable = monaco.languages.registerCompletionItemProvider(
        language,
        {
            triggerCharacters: ['#'],
            provideCompletionItems: (model, currentPosition) => {

                const stepInsertText =`{{step.title}}:
    {{#each step.properties as |property propertyName|}}
        {{#if @first}}({{/if}}
        {{propertyName}} = {{property.example}}
        {{#skipLast}},{{/skipLast}}
        {{#if @last}}){{/if}}
    {{/each}}`
                
                function getStepSnippet(collection: string): monaco.languages.CompletionItem {
                    return {
                        label: `each ${collection}`,
                        insertText: `#each ${collection} as |step|}}
    ${stepInsertText}
{{/each`,
                        kind: monaco.languages.CompletionItemKind.Function,
                        detail: `List all ${collection} properties`,
                        range: null as any
                    }

                }

                function appendSharpLabelTo(helper: monaco.languages.CompletionItem): monaco.languages.CompletionItem[] {
                    return [helper, { ...helper, label: "#" + helper.label }]
                }
                function addBlocksIfMissing(snippet: monaco.languages.CompletionItem) {
                    const isInBlock = isPositionBetween('{{', currentPosition, '}}', model)
                    let startSnippet = '{{', endSnippet = '}}'
                    if (isInBlock) {
                        startSnippet = '', endSnippet = ''
                    }
                    return {
                        ...snippet,
                        insertText: `${startSnippet}${snippet.insertText}${endSnippet}`
                    }
                }
                const whenSnippet = {
                    label: `with when`,
                    insertText: `#with when as |step|}}
    ${stepInsertText}
{{/with`,
                    kind: monaco.languages.CompletionItemKind.Function,
                    detail: `List when properties`,
                    range: null as any
                }
                const stepSnippets = [
                    getStepSnippet('given'),
                    getStepSnippet('then'),
                    whenSnippet
                ].flatMap(ss => appendSharpLabelTo(addBlocksIfMissing(ss)))

                let customHelperSnippets: monaco.languages.CompletionItem[] = []
                if (!isPositionBetween('{{', currentPosition, '}}', model))
                    customHelperSnippets.push({
                        label: 'json',
                        insertText: '\n{{{json .}}}\n',
                        kind: monaco.languages.CompletionItemKind.Function,
                        detail: `Print json`,
                        range: null as any
                    })


                return {
                    suggestions:
                        stepSnippets.concat(customHelperSnippets)

                } as monaco.languages.ProviderResult<monaco.languages.CompletionList>;
            }
        }
    );
    disposables.push(disposable)

}