/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var templateRepository;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adopters/miro/miro-board.ts":
/*!*****************************************!*\
  !*** ./src/adopters/miro/miro-board.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MiroBoard\": () => (/* binding */ MiroBoard)\n/* harmony export */ });\n/* harmony import */ var _app_scenario_builder_board_text_schema_extractor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../app/scenario-builder/board-text-schema-extractor */ \"./src/app/scenario-builder/board-text-schema-extractor.ts\");\n/* harmony import */ var _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global-dependency-container */ \"./src/global-dependency-container.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n/* eslint-disable no-undef */\n\n\n// import { log } from \"./libs/logging/log\";\nclass MiroBoard {\n    constructor() {\n        this.unselectAll = () => __awaiter(this, void 0, void 0, function* () {\n            if (!miro || !miro.board)\n                yield new Promise(resolve => setTimeout(resolve, 200));\n            yield miro.board.selection.clear();\n        });\n        this.showNotification = (message) => miro.showNotification(message);\n        this.zoomTo = (widget) => miro.board.viewport.zoomToObject(widget.id, true);\n    }\n    openModal(iframeURL, options) {\n        return miro.board.ui.openModal(iframeURL, options);\n    }\n    // eslint-disable-next-line no-unused-vars\n    onWidgetLeft(updateText) {\n        const select = (selections) => __awaiter(this, void 0, void 0, function* () {\n            var widgets = selections.data;\n            if (!this.previouslySelectedWidgets)\n                this.previouslySelectedWidgets = widgets;\n            this.previouslySelectedWidgets.forEach(item => updateText(item.id));\n            this.previouslySelectedWidgets = widgets;\n        });\n        miro.addListener(\"SELECTION_UPDATED\", select);\n    }\n    // eslint-disable-next-line no-unused-vars\n    interceptPossibleTextEdit(updateText) {\n        const select = (selections) => __awaiter(this, void 0, void 0, function* () {\n            var widgets = selections.data;\n            if (!this.previouslySelectedWidgets) {\n                this.previouslySelectedWidgets = widgets;\n            }\n            this.previouslySelectedWidgets.forEach((item) => __awaiter(this, void 0, void 0, function* () {\n                let widget = (yield miro.board.widgets.get({ id: item.id }))[0];\n                const originalWidgetText = yield extractWidgetText(widget);\n                const newText = yield updateText(widget.id, originalWidgetText);\n                widget = yield setWidgetText(widget, newText);\n                if (newText != originalWidgetText)\n                    yield miro.board.widgets.update([widget]);\n            }));\n            this.previouslySelectedWidgets = widgets;\n        });\n        miro.addListener(\"SELECTION_UPDATED\", select);\n    }\n    // eslint-disable-next-line no-unused-vars\n    getWidgetText(widgetId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Finding widget by id:\" + widgetId);\n            var widget = (yield miro.board.widgets.get({ id: widgetId }))[0];\n            return yield extractWidgetText(widget);\n        });\n    }\n    updateWidgetText(widgetId, newWidgetText) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let widget = (yield miro.board.widgets.get({ id: widgetId }))[0];\n            widget = yield setWidgetText(widget, newWidgetText);\n            yield miro.board.widgets.update([widget]);\n        });\n    }\n    // eslint-disable-next-line no-unused-vars\n    onNextSingleSelection(succeed) {\n        //TODO: Guard \n        _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Waiting for the next single selection!\");\n        const select = (selections) => __awaiter(this, void 0, void 0, function* () {\n            var widgets = selections.data;\n            if (widgets.length == 0)\n                return;\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Selected.\");\n            if (widgets.length > 1) {\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(`${widgets.length} items are selected. Only a single one can be selected.`);\n                return;\n            }\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Getting the widget.\");\n            var widget = (yield miro.board.widgets.get({ id: widgets[0].id }))[0];\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Converting the widget\");\n            extractSchemaFrom(widget)\n                .then(selected => {\n                // if (typeof dto == 'string')\n                //     logger.log(dto)\n                // else {\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log(\"Selected:\", selected);\n                succeed(selected);\n                miro.removeListener(\"SELECTION_UPDATED\", select);\n                // }\n            })\n                .catch(_global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log);\n        });\n        if (this.previousListener)\n            miro.removeListener(\"SELECTION_UPDATED\", this.previousListener);\n        this.previousListener = select;\n        return miro.addListener(\"SELECTION_UPDATED\", select);\n    }\n}\nfunction getTheStartingWidget(arrow) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const all = yield miro.board.widgets.get({ id: arrow.startWidgetId });\n        if (all.length == 0)\n            yield miro.showNotification(\"Examples should be connected to a fact they belong to.\");\n        return all[0];\n    });\n}\nfunction getIncomingArrows(exampleWidget) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return (yield (yield miro.board.widgets.get({ type: \"LINE\", endWidgetId: exampleWidget.id }))\n            .map(line => line))\n            .filter(line => line.captions.map(caption => caption.text.toLowerCase()).includes(\"example\")\n            && line.style.lineEndStyle != miro.enums.lineArrowheadStyle.NONE);\n    });\n}\nfunction getAbstractionWidgetFor(exampleWidget) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const incomingArrows = yield getIncomingArrows(exampleWidget);\n        if (incomingArrows.length === 0)\n            return Promise.resolve(exampleWidget);\n        const widgetsPointingToThis = yield Promise.all(incomingArrows.map(getTheStartingWidget));\n        if (widgetsPointingToThis.length > 1) {\n            const errorMessage = \"Examples can not belong to more than one abstraction (only one incoming line).\";\n            yield miro.showNotification(errorMessage);\n            return Promise.reject(errorMessage);\n        }\n        return Promise.resolve(widgetsPointingToThis[0]);\n    });\n}\nfunction getWidgetStyle(widget) {\n    const style = {};\n    if (widget[\"style\"] && widget[\"style\"][\"backgroundColor\"]) {\n        _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log('Setting style:', widget[\"style\"][\"backgroundColor\"]);\n        style.backgroundColor = widget[\"style\"][\"backgroundColor\"];\n    }\n    else if (widget[\"style\"] && widget[\"style\"][\"stickerBackgroundColor\"]) {\n        _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log('Setting style:', widget[\"style\"][\"stickerBackgroundColor\"]);\n        style.backgroundColor = widget[\"style\"][\"stickerBackgroundColor\"];\n    }\n    return style;\n}\nfunction extractSchemaFrom(exampleWidget) {\n    return __awaiter(this, void 0, void 0, function* () {\n        var snapshot = {\n            id: exampleWidget.id,\n            // type: widget.type,\n        };\n        const abstractionWidget = yield getAbstractionWidgetFor(exampleWidget);\n        //\n        _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log('Selection dto initiated.', snapshot);\n        snapshot.style = getWidgetStyle(abstractionWidget);\n        let exampleText;\n        let abstractionText;\n        try {\n            const getPlainText = (originalText) => originalText.split('</p><p>').join('\\n')\n                .replace('<p>', '')\n                .replace('</p>', '')\n                .replace('&#43;', '+');\n            exampleText = getPlainText(yield extractWidgetText(exampleWidget));\n            abstractionText = getPlainText(yield extractWidgetText(abstractionWidget));\n        }\n        catch (e) {\n            return Promise.reject('The widget ' + JSON.stringify(exampleWidget) + ' does not have any text.');\n        }\n        _global_dependency_container__WEBPACK_IMPORTED_MODULE_1__.log.log('Widget text converted by board:', exampleText);\n        try {\n            const step = {\n                widgetSnapshot: snapshot,\n                stepSchema: yield (0,_app_scenario_builder_board_text_schema_extractor__WEBPACK_IMPORTED_MODULE_0__.extractStepSchema)({\n                    abstractionWidgetText: abstractionText,\n                    exampleWidgetText: exampleText\n                })\n            };\n            return step;\n        }\n        catch (e) {\n            console.error(e);\n            return Promise.reject(e);\n        }\n    });\n}\nfunction extractWidgetText(widget) {\n    if (!widget)\n        return Promise.reject(\"Cannot get the widget text. The widget is undefined.\");\n    if (\"text\" in widget)\n        return widget[\"text\"];\n    if (\"title\" in widget)\n        return widget[\"title\"];\n    if (\"captions\" in widget\n        && widget[\"captions\"]\n        && widget[\"captions\"][0]\n        && widget[\"captions\"][0][\"text\"])\n        return Promise.resolve(widget[\"captions\"][0][\"text\"]);\n    return Promise.reject(\"Cannot get the widget text. The widget has no text fields.\");\n}\nfunction setWidgetText(widget, text) {\n    const anyWidget = widget;\n    if (\"text\" in widget)\n        anyWidget[\"text\"] = text;\n    else if (\"title\" in widget)\n        anyWidget[\"title\"] = text;\n    else if (\"captions\" in widget)\n        anyWidget[\"captions\"][0][\"text\"] = text;\n    else\n        return Promise.reject(\"Cannot set the widget text. The widget has no text fields.\");\n    return Promise.resolve(anyWidget);\n}\n\n\n//# sourceURL=webpack://templateRepository/./src/adopters/miro/miro-board.ts?");

/***/ }),

/***/ "./src/adopters/miro/miro-template-repository.ts":
/*!*******************************************************!*\
  !*** ./src/adopters/miro/miro-template-repository.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"miroTemplateRepository\": () => (/* binding */ miroTemplateRepository)\n/* harmony export */ });\n/* harmony import */ var _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../global-dependency-container */ \"./src/global-dependency-container.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n/* eslint-disable no-undef */\n/* eslint-disable no-unused-vars */\n\n// const log = console\nclass miroTemplateRepository {\n    constructor() {\n        this.waitUntil = (condition) => {\n            return new Promise((resolve) => {\n                let interval = setInterval(() => {\n                    if (!condition()) {\n                        return;\n                    }\n                    clearInterval(interval);\n                    resolve(null);\n                }, 100);\n            });\n        };\n    }\n    // constructor() {\n    //     miro.board.widgets.get({\n    //         metadata: {\n    //             [miro.   getClientId()]: {\n    //                 \"role\": role,\n    //             }\n    //         }\n    //     }).then(widgets =>\n    //         widgets.forEach(w => {\n    //             logger.log(`Template :${w.metadata} is found.`)\n    //             w.clientVisible = false\n    //             miro.board.widgets.update(w).then(() => logger.log(\"The template widgets are hidden.\"))\n    //         }))\n    // }\n    getAllTemplateNames() {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findAllTemplateWidgets();\n            return widgets\n                .map(w => {\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log('template:' + w.metadata[miro.getClientId()][\"templateName\"] + \"found!\");\n                return w.metadata[miro.getClientId()][\"templateName\"];\n            });\n        });\n    }\n    removeTemplate(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findWidgetByTemplateName(templateName);\n            widgets.forEach((widget) => __awaiter(this, void 0, void 0, function* () { return yield miro.board.widgets.deleteById(widget.id); }));\n        });\n    }\n    createOrReplaceTemplate(originalTemplateName, template) {\n        return __awaiter(this, void 0, void 0, function* () {\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log('createOrReplaceTemplate:');\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log('finding widget for template:', originalTemplateName);\n            var widgets = yield this.findAllTemplateWidgets();\n            var x;\n            var y;\n            if (widgets.length > 0) {\n                const firstWidget = widgets[0];\n                x = firstWidget.x;\n                y = firstWidget.y;\n            }\n            else {\n                const viewport = yield miro.board.viewport.get();\n                x = viewport.x - 200;\n                y = viewport.y - 200;\n            }\n            widgets = this.filterWidgetsByTemplateName(widgets, originalTemplateName);\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(`${widgets.length} widgets found for template with name: ${originalTemplateName}`);\n            // var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));\n            if (widgets.length == 0) {\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(\"Creating template:\", template);\n                yield miro.board.widgets.create({\n                    type: \"TEXT\",\n                    text: template.contentTemplate,\n                    metadata: {\n                        [miro.getClientId()]: template\n                    },\n                    capabilities: {\n                        editable: false\n                    },\n                    style: {\n                        textAlign: \"l\"\n                    },\n                    x: x,\n                    y: y,\n                    // clientVisible: false\n                });\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(`template: ${template.templateName} is created successfully.`);\n            }\n            else {\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(\"Updating template:\", template);\n                var dbWidget = widgets[0];\n                // dbWidget[\"test\"] = template.contentTemplate\n                dbWidget.metadata[miro.getClientId()] = template;\n                // dbWidget.metadata[miro.getClientId()].clientVisible = false;\n                yield miro.board.widgets.update(dbWidget);\n                _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(`template:${template.templateName} is updated successfully.`);\n            }\n        });\n    }\n    findAllTemplateWidgets() {\n        return __awaiter(this, void 0, void 0, function* () {\n            // var stat = (await miro.board.widgets.get()).filter(x => x.type == 'TEXT' && x[\"text\"].includes('using'))\n            // logger.log(\"# of widgets contain using in their text:\", stat.length)\n            yield this.waitUntil(() => miro.board);\n            // while(!miro.board){}\n            var widgets = yield miro.board.widgets.get();\n            // logger.log(\"# of widgets that have metadata.clientId.templateName:\", widgets.filter(i => i.metadata && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()][\"templateName\"]).length)\n            return widgets\n                .filter(i => i.type == 'TEXT'\n                && i.metadata && i.metadata[miro.getClientId()]\n                && i.metadata[miro.getClientId()]\n                && i.metadata[miro.getClientId()][\"templateName\"]);\n        });\n    }\n    filterWidgetsByTemplateName(widgets, templateName) {\n        return widgets.filter(w => w.metadata[miro.getClientId()][\"templateName\"] == templateName);\n    }\n    findWidgetByTemplateName(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return this.filterWidgetsByTemplateName(yield this.findAllTemplateWidgets(), templateName);\n        });\n    }\n    getTemplateByName(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findWidgetByTemplateName(templateName);\n            if (widgets.length == 0)\n                throw new Error(\"Widget not found for template:\" + templateName);\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(\"Widgets found:\", widgets);\n            var template = widgets[0].metadata[miro.getClientId()];\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(\"Corresponding metadata:\", widgets[0].metadata[miro.getClientId()]);\n            _global_dependency_container__WEBPACK_IMPORTED_MODULE_0__.log.log(\"Corresponding template:\", template);\n            return template;\n        });\n    }\n}\n\n\n//# sourceURL=webpack://templateRepository/./src/adopters/miro/miro-template-repository.ts?");

/***/ }),

/***/ "./src/adopters/template-repository.ts":
/*!*********************************************!*\
  !*** ./src/adopters/template-repository.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTemplateRepository\": () => (/* binding */ getTemplateRepository)\n/* harmony export */ });\n/* harmony import */ var _app_template_processing_default_templates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app/template-processing/default-templates */ \"./src/app/template-processing/default-templates.js\");\n/* harmony import */ var _miro_miro_template_repository__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./miro/miro-template-repository */ \"./src/adopters/miro/miro-template-repository.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\nfunction addSamplesToRepository(repository) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const sampleTemplates = _app_template_processing_default_templates__WEBPACK_IMPORTED_MODULE_0__.defaultTemplates;\n        for (var i = 0; i < sampleTemplates.length; i++) {\n            yield repository.createOrReplaceTemplate(sampleTemplates[i].templateName, sampleTemplates[i]);\n        }\n        // sampleTemplates.forEach(async x => await repository.createOrReplaceTemplate(x))\n    });\n}\nfunction getTemplateRepository() {\n    return __awaiter(this, void 0, void 0, function* () {\n        var singletonInstance = new _miro_miro_template_repository__WEBPACK_IMPORTED_MODULE_1__.miroTemplateRepository();\n        // var singletonInstance = new inMemoryTemplateRepository()\n        yield addSamplesToRepository(singletonInstance);\n        return singletonInstance;\n    });\n}\n// export async function createOrUpdateSampleTemplates() {\n//     var singletonInstance = await getTemplateRepository()\n//     await addSamplesToRepository(singletonInstance)\n// }\n\n\n//# sourceURL=webpack://templateRepository/./src/adopters/template-repository.ts?");

/***/ }),

/***/ "./src/app/scenario-builder/board-text-schema-extractor.ts":
/*!*****************************************************************!*\
  !*** ./src/app/scenario-builder/board-text-schema-extractor.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"extractStepSchema\": () => (/* binding */ extractStepSchema)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nconst toSnakeCase = (str) => str.trim()\n    .replace(/(([^A-Z0-9]+)(.)?)/ig, '_$1')\n    .replace(/-/g, '')\n    .replace(/\\s/g, '')\n    .replace(/_+/g, '_')\n    .toLowerCase();\nconst removeStartingDash = (str) => str[0] == '-' ? str.substring(1) : str;\nfunction extractStepSchema({ abstractionWidgetText, exampleWidgetText }) {\n    return __awaiter(this, void 0, void 0, function* () {\n        let title = abstractionWidgetText.trim().split('\\n').shift();\n        if (!title) {\n            return Promise.reject(\"Unknown text format.\");\n        }\n        const rows = exampleWidgetText.split(/\\n|;|,|\\//);\n        if (rows[0] == title) {\n            rows.shift();\n        }\n        title = toSnakeCase(title).trim();\n        var props = {};\n        rows.map(row => row.split(\":\")).forEach(kv => {\n            const purePropertyName = removeStartingDash(kv[0].trim());\n            if (purePropertyName == '')\n                return;\n            const propertyName = toSnakeCase(purePropertyName);\n            let propertyValue = kv[1];\n            if (!propertyValue) {\n                propertyValue = purePropertyName;\n            }\n            props[propertyName] = {\n                type: \"string\",\n                description: propertyName,\n                example: propertyValue.trim()\n            };\n        });\n        return Promise.resolve({\n            $schema: \"http://json-schema.org/draft-07/schema#\",\n            type: 'object',\n            title: title,\n            properties: props,\n        });\n    });\n}\nconst toCamelCase = (str) => str.trim() //.toLowerCase()\n    .replace(/([^A-Z0-9]+)(.)/ig, function () {\n    return arguments[2].toUpperCase();\n});\n\n\n//# sourceURL=webpack://templateRepository/./src/app/scenario-builder/board-text-schema-extractor.ts?");

/***/ }),

/***/ "./src/app/template-processing/default-templates.js":
/*!**********************************************************!*\
  !*** ./src/app/template-processing/default-templates.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"defaultTemplates\": () => (/* binding */ defaultTemplates)\n/* harmony export */ });\nconst defaultTemplates = [\n    {\n        templateName: \"sample-template\",\n        fileNameTemplate: \"{{scenario}}\",\n        fileExtension: \"cs\",\n        contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n{{#* inline \"callConstructor\"}}\nnew {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\npublic class {{scenario}} : IStorySpecification\n{\n    public IDomainEvent[] Given\n    => new IDomainEvent[]{\n{{#each givens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public ICommand When\n    => {{> callConstructor when}};\n\n    public IDomainEvent[] Then\n    => new IDomainEvent[]{\n{{#each thens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public string Sut { get; } = nameof({{sut}});\n\n    [Fact]\n    public void Run()\n    => TestAdapter.Test(this\n            , setupUseCases: eventStore =>\n                    new[] {\n                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                    });\n}\n}`\n    },\n    {\n        templateName: \"sample-template2\",\n        fileNameTemplate: \"{{scenario}}\",\n        fileExtension: \"features\",\n        contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n{{#* inline \"callConstructor\"}}\nnew {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\npublic class {{scenario}} : IStorySpecification\n{\n    public IDomainEvent[] Given\n    => new IDomainEvent[]{\n{{#each givens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n    public ICommand When\n    => {{> callConstructor when}};\n    public IDomainEvent[] Then\n    => new IDomainEvent[]{\n{{#each thens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public string Sut { get; } = nameof({{sut}});\n\n    [Fact]\n    public void Run()\n    => TestAdapter.Test(this\n            , setupUseCases: eventStore =>\n                    new[] {\n                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                    });\n}\n}`\n    },\n];\n\n\n//# sourceURL=webpack://templateRepository/./src/app/template-processing/default-templates.js?");

/***/ }),

/***/ "./src/global-dependency-container.ts":
/*!********************************************!*\
  !*** ./src/global-dependency-container.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"singletonBoard\": () => (/* binding */ singletonBoard),\n/* harmony export */   \"testResultReports\": () => (/* binding */ testResultReports),\n/* harmony export */   \"log\": () => (/* binding */ log)\n/* harmony export */ });\n/* harmony import */ var _test_result_reports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test-result-reports */ \"./src/test-result-reports.ts\");\n/* harmony import */ var _adopters_miro_miro_board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adopters/miro/miro-board */ \"./src/adopters/miro/miro-board.ts\");\n\n// import { MockBoard } from \"./adopters/mocks/board-mock\";\n// export let singletonBoard: IBoard = MockBoard()\n\nlet singletonBoard = new _adopters_miro_miro_board__WEBPACK_IMPORTED_MODULE_1__.MiroBoard();\nlet testResultReports = new _test_result_reports__WEBPACK_IMPORTED_MODULE_0__.TestResultReports();\nlet log = console;\n\n\n//# sourceURL=webpack://templateRepository/./src/global-dependency-container.ts?");

/***/ }),

/***/ "./src/test-result-reports.ts":
/*!************************************!*\
  !*** ./src/test-result-reports.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WhenTestResultsSummeryViewModel\": () => (/* binding */ WhenTestResultsSummeryViewModel),\n/* harmony export */   \"WhenTestReportViewModel\": () => (/* binding */ WhenTestReportViewModel),\n/* harmony export */   \"TestResultReports\": () => (/* binding */ TestResultReports),\n/* harmony export */   \"TestReportToSummery\": () => (/* binding */ TestReportToSummery)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n/* eslint-disable no-undef */\nclass WhenTestResultsSummeryViewModel {\n}\nclass WhenTestReportViewModel {\n}\nclass TestResultReports {\n    constructor() {\n        this.getTestSummeryForWidget = (widgetId) => __awaiter(this, void 0, void 0, function* () {\n            const widget = (yield miro.board.widgets.get({ id: widgetId }))[0];\n            if (!widget\n                || !widget.metadata[miro.getClientId()]\n                || !widget.metadata[miro.getClientId()].testReport\n                || !widget.metadata[miro.getClientId()].testReport) {\n                return false;\n            }\n            const report = widget.metadata[miro.getClientId()].testReport;\n            // const result: WhenTestResultsSummeryViewModel = {\n            //     total: (report.passed ?? []).length + (report.failed ?? []).length + (report.pending ?? []).length + (report.skipped ?? []).length,\n            //     passed: (report.passed ?? []).length,\n            //     failed: (report.failed ?? []).length,\n            //     skipped: (report.skipped ?? []).length,\n            //     pending: (report.pending ?? []).length,\n            //     // example: widget.metadata[miro.getClientId()].testSummery.example\n            // }\n            return TestReportToSummery(report);\n            // if (!widget\n            //     || !widget.metadata[miro.getClientId()]\n            //     || !widget.metadata[miro.getClientId()].testReport\n            //     || !(widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel)\n            //     || !((widget.metadata[miro.getClientId()].testReport as WhenTestReportViewModel).summery)) {\n            //     return false\n            // }\n            // return widget.metadata[miro.getClientId()].testSummery as WhenTestResultsSummeryViewModel\n        });\n    }\n}\nfunction TestReportToSummery(report) {\n    var _a, _b, _c, _d, _e, _f, _g, _h;\n    const result = {\n        total: ((_a = report.passed) !== null && _a !== void 0 ? _a : []).length + ((_b = report.failed) !== null && _b !== void 0 ? _b : []).length + ((_c = report.pending) !== null && _c !== void 0 ? _c : []).length + ((_d = report.skipped) !== null && _d !== void 0 ? _d : []).length,\n        passed: ((_e = report.passed) !== null && _e !== void 0 ? _e : []).length,\n        failed: ((_f = report.failed) !== null && _f !== void 0 ? _f : []).length,\n        skipped: ((_g = report.skipped) !== null && _g !== void 0 ? _g : []).length,\n        pending: ((_h = report.pending) !== null && _h !== void 0 ? _h : []).length,\n        // example: widget.metadata[miro.getClientId()].testSummery.example\n    };\n    return result;\n}\n\n\n//# sourceURL=webpack://templateRepository/./src/test-result-reports.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/adopters/template-repository.ts");
/******/ 	templateRepository = __webpack_exports__;
/******/ 	
/******/ })()
;