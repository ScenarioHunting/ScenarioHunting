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
    phrase: string
): EditorSuggestion[] {
    if (phrase.startsWith('.'))
        return []

    if (phrase.length === 0)
        return allSuggestions

    const wordChain = phrase.split('.').filter(s => s !== '');

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
    console.log("matchedSuggestion", matchedSuggestion)

    if (matchedSuggestion?.children)
        return currentLevel

    if (phrase.endsWith('.'))
        return []

    if (matchedSuggestion)
        return currentLevel.filter(s => s.insertText.includes(phrase))

    return currentLevel
}

const getPhraseBetween = (start: monaco.IPosition | undefined
    , end: monaco.IPosition | undefined
    , model: monaco.editor.ITextModel): string => {
    if (!start || !end)
        return ""

    return splitLast(model.getValueInRange({
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
    }), [' ', '\n']).trim()
}

const buildSuggestions = (
    allSuggestions: EditorSuggestion[],
    currentPosition: monaco.IPosition,
    model: monaco.editor.ITextModel): monaco.languages.CompletionItem[] => {

    console.log('All suggestions:', allSuggestions)

    if (!isPositionBetween('{{', currentPosition, '}}', model))
        return []

    let currentPhrase = getPhraseBetween(
        model.findPreviousMatch('{{', currentPosition, false, false, null, false)?.range?.getEndPosition(),
        currentPosition,
        model)

    console.log('current phrase:', currentPhrase)
    const results = filterSuggestionsFor(allSuggestions, currentPhrase).map(mapSuggestion)
    console.log('Suggestion results:', results)
    return results
}


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
const modelSuggestions: EditorSuggestion[] = [
    {
        label: "model",
        insertText: "model",

        children: [
            {
                label: "context",
                insertText: "context"
            },
            {
                label: "subject",
                insertText: "subject"
            },
            {
                label: "scenario",
                insertText: "scenario"
            },
            {
                label: "when",
                insertText: "when",
                children: [
                    {
                        label: "title",
                        insertText: "title"
                    },
                    {
                        label: "type",
                        insertText: "type"
                    },
                    {
                        label: "properties",
                        insertText: "properties",
                        detail: "the properties..................."
                    }]
            }]
    }

]

let disposable: monaco.IDisposable | undefined


export const applyIntellisense = (language: string) => {
    disposable?.dispose()
    disposable = monaco.languages.registerCompletionItemProvider(
        language,
        {
            triggerCharacters: ['{', '.'],
            provideCompletionItems: (model, position) => {
                console.log('Providing completion items.')
                return {
                    suggestions: buildSuggestions(
                        modelSuggestions.concat(propertySuggestions),
                        position,
                        model),
                } as monaco.languages.ProviderResult<monaco.languages.CompletionList>;
            }
        }
    );
}