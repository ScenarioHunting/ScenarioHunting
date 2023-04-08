/* eslint-disable no-undef */
import { ExternalServices, log } from '../../external-services'
import { defaultTestSpec } from './default-test-spec'
import { applyIntellisense } from './intellisense'
import { URLParameters } from './url-parameters'
import { editorFactory } from './template-studio-factory'
import { domElementClasses } from './dom-element-classes'
import { getLanguageForExtension } from './monaco-languages'
// import svg from './template-studio.images/show-preview.svg'
// console.log("SVG:", svg)
// import { validTextTemplate } from "../ports/text-template"

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
    var originalTemplateName = URLParameters.getByName("templateName", window.location.href) ?? ""
    originalTemplateName = originalTemplateName.trim()
    // const isInEditMode = URLParameters.getByName("mode", window.location.href) == "edit"
    const isInEditMode = originalTemplateName
        && originalTemplateName != ""
        && originalTemplateName != "new"
    if (isInEditMode) {
        document.getElementById("templateName").value = originalTemplateName
        document.getElementById('templateName').disabled = true
    }

    window.save = async function () {
        try {
            const template = {
                templateName: document.getElementById("templateName").value,
                contentTemplate: editor.getValue(),
                fileNameTemplate: document.getElementById('fileNameTemplate').value,
                fileExtension: document.getElementById("target-file-extension").value,
            }
            log.log("Template is being saved:", template.contentTemplate)
            await ExternalServices.templateRepository
                .createOrReplaceTemplate(template)
            await showNotification(`${template.templateName} saved.`)
            window.closeModal()
        } catch (e) {
            alert(e)
        }
    }

    //Preview:
    function createErrorMarker(err, currentLineNumber) {
        return {
            startLineNumber: err.startLineNumber ?? currentLineNumber,
            endLineNumber: err.endLineNumber ?? currentLineNumber + 1,
            startColumn: err.startColumn,
            endColumn: err.endColumn,
            message: err.message,
            severity: monaco.MarkerSeverity.Error
        }
    }

    function showError(err, position, editorModel) {
        monaco.editor.setModelMarkers(
            editorModel, null, [createErrorMarker(err, position.LineNumber)]);
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
    let preview = async function (language, editorModel) {
        //<On editor text change(not preview)
        const template = editor.getValue()
        let compiledCode = ""

        try {
            compiledCode = ExternalServices.templateCompiler.compileTemplate(template, sampleTestSpec)
            clearErrors(editorModel)
        }
        catch (err) {
            showError(err, editor.getPosition(), editorModel)
        }
        //</On editor text change(not preview)

        const actualCodeModel = monaco.editor.createModel(compiledCode, language);

        const previousExpectedCode = previewEditor.getModifiedEditor().getValue();
        let expectedCodeModel = isInEditMode && previousExpectedCode == ""
            ? actualCodeModel
            : monaco.editor.createModel(previousExpectedCode, language);

        previewEditor.setModel({ original: actualCodeModel, modified: expectedCodeModel });
    }
    // })()

    //Preview pane visibility:
    var isPreviewOpen = true;
    function showPreview() {
        isPreviewOpen = true
        const previewButton = document.getElementById('preview-button')
        previewButton.innerHTML = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="View"><path d="M61.5059,48.1372,53.6472,43.53a36.5883,36.5883,0,0,0,8.2747-11.1422,1.005,1.005,0,0,0,0-.7764C61.8389,31.416,53.416,12,32,12a31.08,31.08,0,0,0-20.0536,7.0851l-8.44-4.9479a1,1,0,0,0-1.0118,1.7256L10.3528,20.47A36.5883,36.5883,0,0,0,2.0781,31.6118a1.005,1.005,0,0,0,0,.7764C2.1611,32.584,10.584,52,32,52a31.08,31.08,0,0,0,20.0536-7.0851l8.4405,4.9479a1,1,0,0,0,1.0118-1.7256ZM32,14c18.4189,0,26.6172,15.3408,27.8984,18a35.1472,35.1472,0,0,1-8.0557,10.4725l-9.0336-5.2954a11.9843,11.9843,0,0,0-20.608-12.0806l-8.4029-4.9258A29.1222,29.1222,0,0,1,32,14ZM22.92,27.8364,40.0654,37.8873A9.9849,9.9849,0,0,1,22.92,27.8364Zm1.015-1.7237A9.9849,9.9849,0,0,1,41.08,36.1636ZM32,50C13.5811,50,5.3828,34.6592,4.1016,32a35.1472,35.1472,0,0,1,8.0557-10.4725l9.0336,5.2954a11.9843,11.9843,0,0,0,20.608,12.0806l8.4029,4.9258A29.1222,29.1222,0,0,1,32,50Z" /></g></svg>`
        previewButton.title = "Hide Preview"
        document.getElementById('preview-editor').style.display = 'block'
        document.getElementById('monaco-editor').style.width = '555px'
    }
    function hidePreview() {
        isPreviewOpen = false
        const previewButton = document.getElementById('preview-button')
        previewButton.innerHTML = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g data-name="View" id="View-2"><path d="M61.9219,31.6118C61.8389,31.416,53.416,12,32,12S2.1611,31.416,2.0781,31.6118a1.005,1.005,0,0,0,0,.7764C2.1611,32.584,10.584,52,32,52S61.8389,32.584,61.9219,32.3882A1.005,1.005,0,0,0,61.9219,31.6118ZM32,50C13.5811,50,5.3828,34.6592,4.1016,32,5.3828,29.3408,13.5811,14,32,14S58.6172,29.3408,59.8984,32C58.6172,34.6592,50.4189,50,32,50Z"/><path d="M32,20A12,12,0,1,0,44,32,12.0137,12.0137,0,0,0,32,20Zm0,22A10,10,0,1,1,42,32,10.0111,10.0111,0,0,1,32,42Z"/></g></svg>'
        previewButton.title = "Preview"
        // document.getElementById('preview-editor').style.width = '0px'
        document.getElementById('preview-editor').style.display = 'none'
        document.getElementById('monaco-editor').style.width = '100%'
    }
    window.togglePreview = function () {
        if (isPreviewOpen) {
            hidePreview()
        } else {
            showPreview()
        }
    }
    showPreview()
    //eof preview

    //Language:
    var editorModel
    function switchEditorLanguage(editor, language) {
        applyIntellisense(language)
        editorModel = monaco.editor.createModel(editor.getValue(), language)
        editor.setModel(editorModel)

    }
    async function switchPreviewLanguage(language = document.getElementById("language-select").value) {
        if (document.getElementById('editor-uses-preview-language-checkbox').checked)
            switchEditorLanguage(editor, language)
        await preview(language, editorModel)
    }
    window.switchLanguage = switchPreviewLanguage
    function onEditorLanguagePreferenceChange() {
        const language = document.getElementById("language-select").value
        if (document.getElementById('editor-uses-preview-language-checkbox').checked)
            switchEditorLanguage(editor, language)
        else
            switchEditorLanguage(editor, 'handlebars')

    }
    window.onEditorLanguagePreferenceChange = onEditorLanguagePreferenceChange





    //Theme:
    function toggleTheme() {
        const wasDark = document.getElementsByTagName('body')[0]
            .classList.contains('dark-body')

        const themeButton = document.getElementById('theme-button')
        if (wasDark) {
            monaco.editor.setTheme('monokai')
            themeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="350" height="350" viewBox="0 0 350 350" xml:space="preserve">
            <g id="icon" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.50 3.50)" >
                <path d="M 46.792 90 c -3.908 0 -7.841 -0.514 -11.717 -1.552 c -11.607 -3.11 -21.309 -10.555 -27.317 -20.961 s -7.604 -22.53 -4.494 -34.137 c 3.11 -11.607 10.554 -21.309 20.961 -27.317 C 32.827 1.066 42.58 -0.89 52.417 0.374 c 0.419 0.054 0.76 0.365 0.849 0.777 c 0.091 0.412 -0.088 0.837 -0.445 1.062 c -15.589 9.766 -20.593 29.899 -11.392 45.835 l 0 0 C 50.63 63.985 70.57 69.716 86.819 61.099 c 0.372 -0.196 0.83 -0.141 1.142 0.145 c 0.312 0.284 0.412 0.734 0.249 1.124 c -3.827 9.156 -10.396 16.619 -18.998 21.586 C 62.281 87.956 54.588 90 46.792 90 z M 46.609 2 c -7.486 0 -14.787 1.956 -21.384 5.765 C 15.281 13.506 8.168 22.776 5.196 33.867 S 3.749 56.543 9.49 66.487 c 5.741 9.945 15.011 17.058 26.102 20.03 c 11.092 2.971 22.676 1.448 32.62 -4.295 c 7.426 -4.287 13.267 -10.523 17.022 -18.139 c -16.701 7.295 -36.267 1.021 -45.538 -15.036 s -4.921 -36.139 9.747 -46.954 C 48.497 2.03 47.551 2 46.609 2 z" transform=" matrix(1 0 0 1 0 0) " />
            </g>
            </svg>
            </svg>`
            themeButton.title = "Dark Mode"
        } else {
            monaco.editor.setTheme('vs-dark')
            themeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="350" height="350" viewBox="0 0 350 350" xml:space="preserve">
            <g id="icon" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" >
                <path d="M 45 69.111 c -13.295 0 -24.111 -10.816 -24.111 -24.111 S 31.705 20.889 45 20.889 S 69.111 31.705 69.111 45 S 58.295 69.111 45 69.111 z M 45 22.889 c -12.192 0 -22.111 9.919 -22.111 22.111 S 32.808 67.111 45 67.111 S 67.111 57.192 67.111 45 S 57.192 22.889 45 22.889 z" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 45 14.105 c -0.552 0 -1 -0.448 -1 -1 V 1 c 0 -0.552 0.448 -1 1 -1 s 1 0.448 1 1 v 12.105 C 46 13.658 45.552 14.105 45 14.105 z" style=" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 45 90 c -0.552 0 -1 -0.447 -1 -1 V 76.895 c 0 -0.553 0.448 -1 1 -1 s 1 0.447 1 1 V 89 C 46 89.553 45.552 90 45 90 z" style=" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 13.105 46 H 1 c -0.552 0 -1 -0.448 -1 -1 s 0.448 -1 1 -1 h 12.105 c 0.552 0 1 0.448 1 1 S 13.658 46 13.105 46 z" style=" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 89 46 H 76.895 c -0.553 0 -1 -0.448 -1 -1 s 0.447 -1 1 -1 H 89 c 0.553 0 1 0.448 1 1 S 89.553 46 89 46 z" style=" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 67.553 23.447 c -0.256 0 -0.512 -0.098 -0.707 -0.293 c -0.391 -0.391 -0.391 -1.023 0 -1.414 l 8.56 -8.56 c 0.391 -0.391 1.023 -0.391 1.414 0 s 0.391 1.023 0 1.414 l -8.56 8.56 C 68.064 23.35 67.809 23.447 67.553 23.447 z"  transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 13.887 77.112 c -0.256 0 -0.512 -0.098 -0.707 -0.293 c -0.391 -0.391 -0.391 -1.023 0 -1.414 l 8.56 -8.56 c 0.391 -0.391 1.023 -0.391 1.414 0 s 0.391 1.023 0 1.414 l -8.56 8.56 C 14.399 77.015 14.143 77.112 13.887 77.112 z" transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 22.447 23.447 c -0.256 0 -0.512 -0.098 -0.707 -0.293 l -8.56 -8.56 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 8.56 8.56 c 0.391 0.391 0.391 1.023 0 1.414 C 22.959 23.35 22.703 23.447 22.447 23.447 z"   transform=" matrix(1 0 0 1 0 0) " />
                <path d="M 76.112 77.112 c -0.256 0 -0.512 -0.098 -0.707 -0.293 l -8.56 -8.56 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 8.56 8.56 c 0.391 0.391 0.391 1.023 0 1.414 C 76.624 77.015 76.368 77.112 76.112 77.112 z"  transform=" matrix(1 0 0 1 0 0) " />
            </g>
            </svg>`
            themeButton.title = "Light Mode"
        }

        const oldTheme = wasDark ? 'dark' : 'light';
        const newTheme = wasDark ? 'light' : 'dark';


        domElementClasses.changePrefixesByPostfix({
            elements: document.getElementsByTagName('input'),
            classPostfix: 'text-input',
            oldClassPrefix: oldTheme,
            newClassPrefix: newTheme
        })
        domElementClasses.switchMode({
            oldClassPrefix: oldTheme,
            newClassPrefix: newTheme
        })

    }

    window.toggleTheme = toggleTheme



    //On editor ready:

    window.onEditorReady = async function () {

        let languageSelect = document.getElementById("language-select");
        const monacoLanguages = monaco.languages.getLanguages()
        monacoLanguages.forEach(l => languageSelect.add(new Option(l.aliases[0], l.id)))

        // select_elem.value = 'yaml'
        let templateContent = undefined;
        try {
            const template = await ExternalServices.templateRepository
                .getTemplateByName(isInEditMode ? originalTemplateName : "new")//.textTemplate
            log.log(`Template ${originalTemplateName} is being loaded to the editor:`, template)
            document.getElementById('fileNameTemplate').value = template.fileNameTemplate
            document.getElementById("target-file-extension").value = template.fileExtension
            templateContent = template.contentTemplate
            languageSelect.value = getLanguageForExtension(template.fileExtension)

            // lang = monacoLanguages.filter(l => l.extensions.includes(template.fileExtension))[0].aliases[0];// 
            //  getLanguageForExtension(template.fileExtension)
            // log.log(`Language: found for ext:`, template.fileExtension)
            // languageSelect.value = lang
        } catch {
            log.warn("The template 'new' does not exists in the repository")
        }
        editor = editorFactory.createEditor(document.getElementById('monaco-editor'), templateContent)
        previewEditor = editorFactory.createPreviewEditor(document.getElementById('preview-editor'))

        // await detectLanguageForExtension()
        // const languageSelect = document.getElementById("language-select")
        switchEditorLanguage(editor, 'handlebars')
        await preview(languageSelect.value, editorModel)
        editor.onDidChangeModelContent(async () => {
            await preview(languageSelect.value, editorModel)
            // switchEditorLanguage(editor, 'Handlebars')
        })

        toggleTheme()
        toggleTheme()
    }


    return window.save
}