export const editorFactory = {
    createEditor(editorElement, templateContent) {

        return monaco.editor.create(editorElement, {
            value: templateContent,
            language: 'handlebars',
            // theme: 'vs-dark',
            // theme: 'monokai',
            lineHeight: 20,
            fontSize: 14,
            // wordWrap: "bounded",
            automaticLayout: true,
            wrappingIndent: 'indent',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            formatOnType: true//!important
        });
    },
    // editor.trigger(A string to insert into the editor, 'editor.action.formatDocument'); 

    createPreviewEditor(editorElement) {
        return monaco.editor.createDiffEditor(editorElement, {
            enableSplitViewResizing: true,
            renderSideBySide: true,
            // value: templateContent,
            // language: 'handlebars',
            // theme: 'vs-dark',
            // theme: 'monokai',
            lineHeight: 20,
            fontSize: 14,
            // wordWrap: "bounded",
            automaticLayout: true,
            // wrappingIndent: 'indent',
            // minimap: { enabled: false },
            scrollBeyondLastLine: false,
            // overviewRulerLanes: 0,
            folding: true,
            showFoldingControls: "always",
            foldingStrategy:"indentation",
            formatOnType: true//!important
        });
    }
}