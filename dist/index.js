/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var ExternalServices;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("const testIcon = '<path fill=\"currentColor\" fill-rule=\"nonzero\" d=\"M10,4h1V2H8V4H9v6.6L2.25,22H21.75L15,10.6Zm3.25,16H5.75L11,11.15V4h2v7.15Z\"/>';\nmiro.onReady(async () => {\n    await miro.initialize({\n        extensionPoints: {\n            // getWidgetMenuItems: (widgets: SDK.IWidget[]/*, editMode: boolean*/): Promise<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]> => {\n            // \tconst supportedWidgetsInSelection = widgets\n            // \t// .filter((widget) => Config.supported_widgets[widget.type.toLowerCase()] \n            // \t// \t\t\t\t\t\t\t\t\t!== undefined);\n            // \t// All selected widgets have to be supported in order to show the menu\n            // \tif (supportedWidgetsInSelection.length == widgets.length && widgets.length == 1) {\n            // \t\treturn Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{\n            // \t\t\ttooltip: 'Make an Example',\n            // \t\t\tsvgIcon: testIcon,//Config.icon,\n            // \t\t\tonClick: () => {\n            // \t\t\t\t// miro.board.ui.openLeftSidebar('app.html')\n            // \t\t\t\t// makeAnExample(widgets[0])\n            // \t\t\t\t// handleAuthAndOpenWindow(openEstimateModal, widgets);\n            // \t\t\t}\n            // \t\t}])\n            // \t}\n            // \t// Not all selected widgets are supported, we won't show the menu\n            // \treturn Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{} as SDK.IWidgetMenuItem]);\n            // },\n            // exportMenu: {\n            // \ttitle: 'Boilerplate export',\n            // \tsvgIcon: icon24,\n            // \tonClick: () => {\n            // \t\t// Remember that 'modal.html' resolves relative to main.js file. So modal.html have to be in the /dist/ folder.\n            // \t\tmiro.board.ui.openModal('modal.html')\n            // \t}\n            // },\n            bottomBar: {\n                title: 'Scenario Hunting',\n                svgIcon: testIcon,\n                onClick: () => {\n                    miro.board.ui.openLeftSidebar('app.html');\n                }\n            }\n        }\n    });\n});\n\n\n//# sourceURL=webpack://ExternalServices/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	ExternalServices = __webpack_exports__;
/******/ 	
/******/ })()
;