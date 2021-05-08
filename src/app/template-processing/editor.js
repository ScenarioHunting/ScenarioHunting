/* eslint-disable no-undef */
import { ExternalServices } from '../../external-services'
import { getLanguageForExtension } from './monaco-languages'
import { defaultTestSpec } from './default-test-spec'
import { applyIntellisense } from './intellisense'
import { URLParameters } from './url-parameters'
import { editorFactory } from './editor-factory'
import { domElementClasses } from './dom-element-classes'

window.setupEditor = async () => {
    let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min'
    };
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/base/worker/workerMain.min.js');
    `], { type: 'text/javascript' }));
    window.MonacoEnvironment = { getWorkerUrl: () => proxy };

    window.closeModal = ExternalServices.boardService.closeModal


    const showNotification = ExternalServices.boardService.showNotification



    // let templateContent = ""
    let editor//: monaco.editor.IStandaloneCodeEditor
    let previewEditor
    const originalTemplateName = URLParameters.getByName("templateName", window.location.href)
    document.getElementById("templateName").value = originalTemplateName

    window.save = async function () {
        const template = {
            templateName: document.getElementById("templateName").value,
            contentTemplate: editor.getValue(),
            fileNameTemplate: document.getElementById('fileNameTemplate').value,
            fileExtension: document.getElementById('fileExtension').value,
        }
        console.log("Template is being saved:", template.contentTemplate)
        await ExternalServices.templateRepository
            .createOrReplaceTemplate(originalTemplateName, template)
        await showNotification(`${template.templateName} saved.`)
        window.closeModal()
    }

    //Preview:
    function showError(err, position, editorModel) {

        const newMarker = {
            startLineNumber: err.startLineNumber ?? position.lineNumber,
            endLineNumber: err.endLineNumber ?? position.lineNumber + 1,
            startColumn: err.startColumn,
            endColumn: err.endColumn,
            message: err.message,
            severity: monaco.MarkerSeverity.Error
        }
        monaco.editor.setModelMarkers(editorModel, null, [newMarker]);
    }
    function clearErrors(editorModel) {
        monaco.editor.setModelMarkers(editorModel, null, [])
    }


    // let preview
    // (async function () {
    let sampleTestSpec = await ExternalServices.tempSharedStorage.getItem('sample-test-spec')
    await ExternalServices.tempSharedStorage.removeItem('sample-test-spec')
    if (!sampleTestSpec)
        sampleTestSpec = defaultTestSpec
    let preview = async function (fileExtension, editorModel) {

        const template = editor.getValue()
        const language = getLanguageForExtension(fileExtension)
        const expectedCodeModel = monaco.editor.createModel(previewEditor.getModifiedEditor().getValue(), language);
        let compiledCode = ""

        try {
            compiledCode = ExternalServices.templateCompiler.compileTemplate(template, sampleTestSpec)
            clearErrors(editorModel)
        }
        catch (err) {
            showError(err, editor.getPosition(), editorModel)
        }
        const compiledCodeModel = monaco.editor.createModel(compiledCode, language);
        previewEditor.setModel({ original: compiledCodeModel, modified: expectedCodeModel });
        applyIntellisense(language)

    }
    // })()

    //Preview pane visibility:
    function showPreview() {
        document.getElementById('preview-editor').style.display = 'block'
        document.getElementById('monaco-editor').style.width = '40%'
        document.getElementById('preview-button').textContent = 'Hide Preview'
    }
    function hidePreview() {
        document.getElementById('preview-editor').style.display = 'none'
        document.getElementById('monaco-editor').style.width = '100%'
        document.getElementById('preview-button').textContent = 'Show Preview'

    }
    window.togglePreview = function () {
        let isPreviewOpen = document.getElementById('preview-button').textContent == 'Hide Preview'
        if (isPreviewOpen) {
            hidePreview()
        } else {
            showPreview()
        }
    }
    showPreview()
    //eof preview

    //Language:
    function getEditorModel(templateContent, fileExtension) {
        const language = getLanguageForExtension(fileExtension)
        return monaco.editor.createModel(templateContent, language)
    }
    var editorModel
    function switchEditorModel(editor, fileExtension) {
        editorModel = getEditorModel(editor.getValue(), fileExtension)
        editor.setModel(editorModel)
    }
    async function detectLanguageForExtension() {
        switchEditorModel(editor, document.getElementById("fileExtension").value)
        await preview(document.getElementById("fileExtension").value, editorModel)
    }
    window.detectLanguageForExtension = detectLanguageForExtension







    //Theme:
    function toggleTheme() {
        const wasDark = document.getElementsByTagName('body')[0]
            .classList.contains('dark-body')

        if (wasDark) {
            monaco.editor.setTheme('monokai')
            document.getElementById('theme-button').textContent = 'Darken'
        } else {
            monaco.editor.setTheme('vs-dark')
            document.getElementById('theme-button').textContent = 'Lighten'
        }

        const oldClassPrefix = wasDark ? 'dark' : 'light';
        const newClassPrefix = wasDark ? 'light' : 'dark';

        domElementClasses.changePrefixesByPostfix({
            elements: document.getElementsByTagName('body'),
            classPostfix: 'body',
            oldClassPrefix,
            newClassPrefix
        })
        domElementClasses.changePrefixesByPostfix({
            elements: document.getElementsByTagName('input'),
            classPostfix: 'text-input',
            oldClassPrefix,
            newClassPrefix
        })
        domElementClasses.changePrefixesByPostfix({
            elements: document.getElementsByTagName('button'),
            classPostfix: 'button',
            oldClassPrefix,
            newClassPrefix
        })
    }
    window.toggleTheme = toggleTheme



    //On editor ready:

    window.onEditorReady = async function () {
        let templateContent = undefined;
        if (originalTemplateName) {
            const template = await ExternalServices.templateRepository
                .getTemplateByName(originalTemplateName)
            document.getElementById('fileNameTemplate').value = template.fileNameTemplate
            document.getElementById('fileExtension').value = template.fileExtension
            templateContent = template.contentTemplate
        }

        editor = editorFactory.createEditor(document.getElementById('monaco-editor'), templateContent)
        previewEditor = editorFactory.createPreviewEditor(document.getElementById('preview-editor'))

        await detectLanguageForExtension()
        editor.onDidChangeModelContent(async function () {
            await preview(document.getElementById("fileExtension").value, editorModel)
        })

        // monaco.languages.typescript.typescriptDefaults.addExtraLib(
        //     'export declare function add(a: number, b: number): number', 
        //     'file:///monaco.d.ts');
        toggleTheme()
    }


    return window.save
}