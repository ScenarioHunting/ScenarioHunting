/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/test-factory/template-repository.ts":
/*!*************************************************!*\
  !*** ./src/test-factory/template-repository.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTemplateRepository\": () => (/* binding */ getTemplateRepository),\n/* harmony export */   \"createOrUpdateSampleTemplates\": () => (/* binding */ createOrUpdateSampleTemplates)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n/* eslint-disable no-undef */\nclass templateRepository {\n    // constructor() {\n    //     miro.board.widgets.get({\n    //         metadata: {\n    //             [miro.getClientId()]: {\n    //                 \"role\": role,\n    //             }\n    //         }\n    //     }).then(widgets =>\n    //         widgets.forEach(w => {\n    //             console.log(`Template :${w.metadata} is found.`)\n    //             w.clientVisible = false\n    //             miro.board.widgets.update(w).then(() => console.log(\"The template widgets are hidden.\"))\n    //         }))\n    // }\n    getAllTemplateNames() {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findAllTemplateWidgets();\n            return widgets\n                .map(w => {\n                console.log('template:' + w.metadata[miro.getClientId()][\"templateName\"] + \"found!\");\n                return w.metadata[miro.getClientId()][\"templateName\"];\n            });\n        });\n    }\n    removeTemplate(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findWidgetByTemplateName(templateName);\n            widgets.forEach((widget) => __awaiter(this, void 0, void 0, function* () { return yield miro.board.widgets.deleteById(widget.id); }));\n        });\n    }\n    createOrReplaceTemplate(template) {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('createOrReplaceTemplate:');\n            console.log('finding widget for template:', template.templateName);\n            var widgets = yield this.findWidgetByTemplateName(template.templateName);\n            console.log(`${widgets.length} widgets found for template with name: ${template.templateName}`);\n            // var dbWidgets = widgets.filter(i => !isNullOrUndefined(i.metadata[miro.getClientId()].templateName));\n            if (widgets.length == 0) {\n                console.log(\"Creating template:\", template);\n                const viewport = yield miro.board.viewport.get();\n                yield miro.board.widgets.create({\n                    type: \"TEXT\",\n                    text: template.contentTemplate,\n                    metadata: {\n                        [miro.getClientId()]: template\n                    },\n                    capabilities: {\n                        editable: false\n                    },\n                    style: {\n                        textAlign: \"l\"\n                    },\n                    x: viewport.x - 200,\n                    y: viewport.y - 200\n                    // clientVisible: false\n                });\n                console.log(`template: ${template.templateName} is created successfully.`);\n            }\n            else {\n                console.log(\"Updating template:\", template);\n                var dbWidget = widgets[0];\n                // dbWidget[\"test\"] = template.contentTemplate\n                dbWidget.metadata[miro.getClientId()] = template;\n                // dbWidget.metadata[miro.getClientId()].clientVisible = false;\n                yield miro.board.widgets.update(dbWidget);\n                console.log(`template:${template.templateName} is updated successfully.`);\n            }\n        });\n    }\n    findAllTemplateWidgets() {\n        return __awaiter(this, void 0, void 0, function* () {\n            var stat = (yield miro.board.widgets.get()).filter(x => x.type == 'STICKER' && x[\"text\"].includes('using'));\n            console.log(\"# of widgets contain using in their text:\", stat.length);\n            var widgets = yield miro.board.widgets.get();\n            // console.log(\"# of widgets that have metadata.clientId.templateName:\", widgets.filter(i => i.metadata && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()] && i.metadata[miro.getClientId()][\"templateName\"]).length)\n            return widgets\n                .filter(i => i.metadata && i.metadata[\"3074457349056199734\"]\n                && i.metadata[\"3074457349056199734\"]\n                && i.metadata[\"3074457349056199734\"][\"templateName\"]);\n        });\n    }\n    findWidgetByTemplateName(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findAllTemplateWidgets();\n            return widgets.filter(w => w.metadata[miro.getClientId()][\"templateName\"] == templateName);\n        });\n    }\n    getTemplateByName(templateName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            var widgets = yield this.findWidgetByTemplateName(templateName);\n            if (widgets.length == 0)\n                throw new Error(\"Widget not found for template:\" + templateName);\n            console.log(\"Widgets found:\", widgets);\n            var template = widgets[0].metadata[miro.getClientId()];\n            console.log(\"Corresponding metadata:\", widgets[0].metadata[miro.getClientId()]);\n            console.log(\"Corresponding template:\", template);\n            return template;\n        });\n    }\n}\nfunction addSamplesToRepository(repository) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const sampleTemplates = [\n            {\n                fileNameTemplate: \"{{scenario}}\",\n                fileExtension: \"cs\",\n                contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n    {{#* inline \"callConstructor\"}}\n    new {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\n    public class {{scenario}} : IStorySpecification\n    {\n        public IDomainEvent[] Given\n        => new IDomainEvent[]{\n    {{#each givens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n        public ICommand When\n        => {{> callConstructor when}};\n        public IDomainEvent[] Then\n        => new IDomainEvent[]{\n    {{#each thens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n\n        public string Sut { get; } = nameof({{sut}});\n\n        [Fact]\n        public void Run()\n        => TestAdapter.Test(this\n                , setupUseCases: eventStore =>\n                        new[] {\n                        new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                        });\n    }\n}`,\n                templateName: \"sample-template\"\n            },\n            {\n                fileNameTemplate: \"{{scenario}}2\",\n                fileExtension: \"cs\",\n                contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n    {{#* inline \"callConstructor\"}}\n    new {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\n    public class {{scenario}} : IStorySpecification\n    {\n        public IDomainEvent[] Given\n        => new IDomainEvent[]{\n    {{#each givens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n        public ICommand When\n        => {{> callConstructor when}};\n        public IDomainEvent[] Then\n        => new IDomainEvent[]{\n    {{#each thens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n\n        public string Sut { get; } = nameof({{sut}});\n\n        [Fact]\n        public void Run()\n        => TestAdapter.Test(this\n                , setupUseCases: eventStore =>\n                        new[] {\n                        new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                        });\n    }\n}`,\n                templateName: \"sample-template2\"\n            },\n        ];\n        for (var i = 0; i < sampleTemplates.length; i++) {\n            yield repository.createOrReplaceTemplate(sampleTemplates[i]);\n        }\n        // sampleTemplates.forEach(async x => await repository.createOrReplaceTemplate(x))\n    });\n}\nfunction getTemplateRepository() {\n    return __awaiter(this, void 0, void 0, function* () {\n        return new templateRepository();\n    });\n}\nfunction createOrUpdateSampleTemplates() {\n    return __awaiter(this, void 0, void 0, function* () {\n        var singletonInstance = new templateRepository();\n        yield addSamplesToRepository(singletonInstance);\n    });\n}\n\n\n//# sourceURL=webpack://plugin-boilerplate/./src/test-factory/template-repository.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"templateRepository": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./src/test-factory/template-repository.ts"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkplugin_boilerplate"] = self["webpackChunkplugin_boilerplate"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;