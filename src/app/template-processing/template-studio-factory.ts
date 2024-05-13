export const editorFactory = {
    createEditor(editorElement, templateContent) {

        return monaco.editor.create(editorElement, {
            value: templateContent,
            language: 'handlebars',
            lineHeight: 20,
            fontSize: 14,
            automaticLayout: true,
            wrappingIndent: 'indent',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            formatOnType: true//!important
        });
    },

    createPreviewEditor(editorElement) {
        return monaco.editor.createDiffEditor(editorElement, {
            enableSplitViewResizing: true,
            renderSideBySide: true,
            lineHeight: 20,
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            showFoldingControls: "always",
            foldingStrategy: "indentation",
            formatOnType: true//!important
        });
    }
}