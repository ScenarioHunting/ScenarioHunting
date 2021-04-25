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

/***/ "./src/adopters/mocks/in-memory-template-repository.ts":
/*!*************************************************************!*\
  !*** ./src/adopters/mocks/in-memory-template-repository.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"inMemoryTemplateRepository\": () => (/* binding */ inMemoryTemplateRepository)\n/* harmony export */ });\nclass inMemoryTemplateRepository {\n    constructor() {\n        this.templates = [];\n    }\n    createOrReplaceTemplate(originalTemplateName, newTemplate) {\n        const originalTemplate = this.templates.find(t => t.templateName == originalTemplateName);\n        if (originalTemplate) {\n            this.templates = this.templates.map(t => t.templateName == originalTemplateName\n                ? newTemplate\n                : t);\n            return;\n        }\n        this.templates = this.templates.concat(newTemplate);\n    }\n    getAllTemplateNames() {\n        return Promise.resolve(this.templates.map(t => t.templateName));\n    }\n    removeTemplate(templateName) {\n        this.templates = this.templates.filter(t => t.templateName != templateName);\n    }\n    getTemplateByName(templateName) {\n        return Promise.resolve(this.templates.filter(t => t.templateName == templateName)[0]);\n    }\n}\n\n\n//# sourceURL=webpack://templateRepository/./src/adopters/mocks/in-memory-template-repository.ts?");

/***/ }),

/***/ "./src/adopters/template-repository.ts":
/*!*********************************************!*\
  !*** ./src/adopters/template-repository.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTemplateRepository\": () => (/* binding */ getTemplateRepository)\n/* harmony export */ });\n/* harmony import */ var _app_template_processing_default_templates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app/template-processing/default-templates */ \"./src/app/template-processing/default-templates.js\");\n/* harmony import */ var _mocks_in_memory_template_repository__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mocks/in-memory-template-repository */ \"./src/adopters/mocks/in-memory-template-repository.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\nfunction addSamplesToRepository(repository) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const sampleTemplates = _app_template_processing_default_templates__WEBPACK_IMPORTED_MODULE_0__.defaultTemplates;\n        for (var i = 0; i < sampleTemplates.length; i++) {\n            yield repository.createOrReplaceTemplate(sampleTemplates[i].templateName, sampleTemplates[i]);\n        }\n        // sampleTemplates.forEach(async x => await repository.createOrReplaceTemplate(x))\n    });\n}\nfunction getTemplateRepository() {\n    return __awaiter(this, void 0, void 0, function* () {\n        // var singletonInstance = new miroTemplateRepository()\n        var singletonInstance = new _mocks_in_memory_template_repository__WEBPACK_IMPORTED_MODULE_1__.inMemoryTemplateRepository();\n        yield addSamplesToRepository(singletonInstance);\n        return singletonInstance;\n    });\n}\n// export async function createOrUpdateSampleTemplates() {\n//     var singletonInstance = await getTemplateRepository()\n//     await addSamplesToRepository(singletonInstance)\n// }\n\n\n//# sourceURL=webpack://templateRepository/./src/adopters/template-repository.ts?");

/***/ }),

/***/ "./src/app/template-processing/default-templates.js":
/*!**********************************************************!*\
  !*** ./src/app/template-processing/default-templates.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"defaultTemplates\": () => (/* binding */ defaultTemplates)\n/* harmony export */ });\nconst defaultTemplates = [\n    {\n        templateName: \"sample-template\",\n        fileNameTemplate: \"{{scenario}}\",\n        fileExtension: \"cs\",\n        contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n{{#* inline \"callConstructor\"}}\nnew {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\npublic class {{scenario}} : IStorySpecification\n{\n    public IDomainEvent[] Given\n    => new IDomainEvent[]{\n{{#each givens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public ICommand When\n    => {{> callConstructor when}};\n\n    public IDomainEvent[] Then\n    => new IDomainEvent[]{\n{{#each thens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public string Sut { get; } = nameof({{sut}});\n\n    [Fact]\n    public void Run()\n    => TestAdapter.Test(this\n            , setupUseCases: eventStore =>\n                    new[] {\n                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                    });\n}\n}`\n    },\n    {\n        templateName: \"sample-template2\",\n        fileNameTemplate: \"{{scenario}}\",\n        fileExtension: \"features\",\n        contentTemplate: `using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n{{#* inline \"callConstructor\"}}\nnew {{title}}({{#each properties}}\"{{example}}\"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\npublic class {{scenario}} : IStorySpecification\n{\n    public IDomainEvent[] Given\n    => new IDomainEvent[]{\n{{#each givens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n    public ICommand When\n    => {{> callConstructor when}};\n    public IDomainEvent[] Then\n    => new IDomainEvent[]{\n{{#each thens}}\n    {{> callConstructor .}},\n{{/each}}\n    };\n\n    public string Sut { get; } = nameof({{sut}});\n\n    [Fact]\n    public void Run()\n    => TestAdapter.Test(this\n            , setupUseCases: eventStore =>\n                    new[] {\n                    new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                    });\n}\n}`\n    },\n];\n\n\n//# sourceURL=webpack://templateRepository/./src/app/template-processing/default-templates.js?");

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