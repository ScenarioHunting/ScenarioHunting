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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/template-processing/monaco-languages.js":
/*!*********************************************************!*\
  !*** ./src/app/template-processing/monaco-languages.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"monacoLanguage\": () => (/* binding */ monacoLanguage)\n/* harmony export */ });\nconst monacoLanguage = (function () {\n    const extensionLanguages = {\n        css: 'css',\n        json: 'json',\n        mjs: 'javascript',\n        cs: 'csharp',\n        abap: 'abap',\n        aes: 'aes',\n        cls: 'apex',\n        // : 'azcli',//?\n        bat: 'bat',\n        c: 'c',\n        // : 'cameligo',\n        clj: 'clojure',\n        boot: 'clojure',\n        cl2: 'clojure',\n        cljc: 'clojure',\n        \"cljs.hl\": 'clojure',\n        cljs: 'clojure',\n        cljscm: 'clojure',\n        cljx: 'clojure',\n        hic: 'clojure',\n        coffee: 'coffeescript',\n        _coffee: 'coffeescript',\n        cake: 'coffeescript',\n        cjsx: 'coffeescript',\n        cson: 'coffeescript',\n        iced: 'coffeescript',\n        \"cpp\": 'cpp',\n        \"c++\": 'cpp',\n        \"cc\": 'cpp',\n        \"cp\": 'cpp',\n        \"cxx\": 'cpp',\n        \"h\": 'cpp',\n        \"h++\": 'cpp',\n        \"hh\": 'cpp',\n        \"hpp\": 'cpp',\n        \"hxx\": 'cpp',\n        \"inc\": 'cpp',\n        \"inl\": 'cpp',\n        \"ipp\": 'cpp',\n        \"tcc\": 'cpp',\n        \"tpp\": 'cpp',\n        // \"\": 'csp',\n        dart: 'dart',\n        dockerfile: 'dockerfile',\n        ecl: 'ecl',\n        eclxml: 'ecl',\n        fs: 'fsharp',\n        go: 'go',\n        graphql: 'graphql',\n        hbs: 'handlebars',\n        hcl: 'hcl',\n        tf: 'hcl',\n        html: 'html',\n        htm: 'html',\n        ini: 'ini',\n        java: 'java',\n        js: 'javascript',\n        _js: 'javascript',\n        bones: 'javascript',\n        es: 'javascript',\n        es6: 'javascript',\n        frag: 'javascript',\n        gs: 'javascript',\n        jake: 'javascript',\n        jsb: 'javascript',\n        jscad: 'javascript',\n        jsfl: 'javascript',\n        jsm: 'javascript',\n        jss: 'javascript',\n        njs: 'javascript',\n        pac: 'javascript',\n        sjs: 'javascript',\n        ssjs: 'javascript',\n        \"sublime-build\": 'javascript',\n        \"sublime-commands\": 'javascript',\n        \"sublime-completions\": 'javascript',\n        \"sublime-keymap\": 'javascript',\n        \"sublime-macro\": 'javascript',\n        \"sublime-menu\": 'javascript',\n        \"sublime-mousemap\": 'javascript',\n        \"sublime-project\": 'javascript',\n        \"sublime-settings\": 'javascript',\n        \"sublime-theme\": 'javascript',\n        \"sublime-workspace\": 'javascript',\n        \"sublime_metrics\": 'javascript',\n        \"sublime_session\": 'javascript',\n        xsjs: 'javascript',\n        xsjslib: 'javascript',\n        jl: 'julia',\n        kt: 'kotlin',\n        ktm: 'kotlin',\n        kts: 'kotlin',\n        less: 'less',\n        // : 'lexon',\n        lua: 'lua',\n        fcgi: 'lua',\n        nse: 'lua',\n        pd_lua: 'lua',\n        rbxs: 'lua',\n        wlua: 'lua',\n        // : 'm3',\n        md: 'markdown',\n        markdown: 'markdown',\n        mkd: 'markdown',\n        mkdn: 'markdown',\n        mkdown: 'markdown',\n        ron: 'markdown',\n        // : 'mips',\n        // : 'msdax',\n        // sql: 'mysql',\n        pas: 'pascal',\n        dfm: 'pascal',\n        dpr: 'pascal',\n        lpr: 'pascal',\n        pp: 'pascal',\n        // : 'pascaligo',\n        pl: 'perl',\n        al: 'perl',\n        cgi: 'perl',\n        perl: 'perl',\n        ph: 'perl',\n        plx: 'perl',\n        pm: 'perl',\n        pod: 'perl',\n        psgi: 'perl',\n        t: 'perl',\n        // : 'pgsql',\n        php: 'php',\n        txt: 'plaintext',\n        // : 'postiats',\n        // : 'powerquery',\n        ps1: 'powershell',\n        psd1: 'powershell',\n        psm: 'powershell',\n        // : 'pug',\n        py: 'python',\n        bzl: 'python',\n        gyp: 'python',\n        lmi: 'python',\n        pyde: 'python',\n        pyp: 'python',\n        pyt: 'python',\n        pyw: 'python',\n        rpy: 'python',\n        tac: 'python',\n        wsgi: 'python',\n        xpy: 'python',\n        r: 'r',\n        rd: 'r',\n        rsx: 'r',\n        // razor: 'razor',\n        // : 'redis',\n        // : 'redshift',\n        rst: 'restructuredtext',\n        rest: 'restructuredtext',\n        \"rest.txt\": 'restructuredtext',\n        \"rst.txt\": 'restructuredtext',\n        rb: 'ruby',\n        builder: 'ruby',\n        gemspec: 'ruby',\n        god: 'ruby',\n        irbrc: 'ruby',\n        jbuilder: 'ruby',\n        mspec: 'ruby',\n        pluginspec: 'ruby',\n        podspec: 'ruby',\n        rabl: 'ruby',\n        rake: 'ruby',\n        rbuild: 'ruby',\n        rbw: 'ruby',\n        rbx: 'ruby',\n        ru: 'ruby',\n        ruby: 'ruby',\n        thor: 'ruby',\n        watchr: 'ruby',\n        rs: 'rust',\n        \"rs.in\": 'rust',\n        // : 'sb',\n        sbt: 'scala',\n        sc: 'scala',\n        scm: 'scheme',\n        sld: 'scheme',\n        sls: 'scheme',\n        sps: 'scheme',\n        ss: 'scheme',\n        scss: 'scss',\n        sh: 'shell',\n        bash: 'shell',\n        bats: 'shell',\n        command: 'shell',\n        ksh: 'shell',\n        shin: 'shell',\n        tmux: 'shell',\n        tool: 'shell',\n        zsh: 'shell',\n        // : 'sol',\n        sql: 'sql',\n        cql: 'sql',\n        ddl: 'sql',\n        prc: 'sql',\n        tab: 'sql',\n        udf: 'sql',\n        viw: 'sql',\n        // : 'st',\n        swift: 'swift',\n        sv: 'systemverilog',\n        svh: 'systemverilog',\n        vh: 'systemverilog',\n        tcl: 'tcl',\n        adp: 'tcl',\n        tm: 'tcl',\n        twig: 'twig',\n        ts: 'typescript',\n        tsx: 'typescript',\n        vb: 'vb',\n        bas: 'vb',\n        frm: 'vb',\n        frx: 'vb',\n        vba: 'vb',\n        vbhtml: 'vb',\n        vbs: 'vb',\n        v: 'verilog',\n        veo: 'verilog',\n        xml: 'xml',\n        ant: 'xml',\n        axml: 'xml',\n        ccxml: 'xml',\n        clixml: 'xml',\n        cproject: 'xml',\n        csl: 'xml',\n        csproj: 'xml',\n        ct: 'xml',\n        dita: 'xml',\n        ditamap: 'xml',\n        ditaval: 'xml',\n        \"dll.config\": 'xml',\n        dotsettings: 'xml',\n        filters: 'xml',\n        fsproj: 'xml',\n        fxml: 'xml',\n        glade: 'xml',\n        gml: 'xml',\n        grxml: 'xml',\n        iml: 'xml',\n        ivy: 'xml',\n        jelly: 'xml',\n        jsproj: 'xml',\n        kml: 'xml',\n        launch: 'xml',\n        mdpolicy: 'xml',\n        mm: 'xml',\n        mod: 'xml',\n        mxml: 'xml',\n        nproj: 'xml',\n        nuspec: 'xml',\n        odd: 'xml',\n        osm: 'xml',\n        plist: 'xml',\n        props: 'xml',\n        ps1xml: 'xml',\n        psc1: 'xml',\n        pt: 'xml',\n        rdf: 'xml',\n        rss: 'xml',\n        scxml: 'xml',\n        srdf: 'xml',\n        storyboard: 'xml',\n        stTheme: 'xml',\n        \"sublime-snippet\": 'xml',\n        targets: 'xml',\n        tmCommand: 'xml',\n        tml: 'xml',\n        tmLanguage: 'xml',\n        tmPreferences: 'xml',\n        tmSnippet: 'xml',\n        tmTheme: 'xml',\n        ui: 'xml',\n        urdf: 'xml',\n        ux: 'xml',\n        vbproj: 'xml',\n        vcxproj: 'xml',\n        vssettings: 'xml',\n        vxml: 'xml',\n        wsdl: 'xml',\n        wsf: 'xml',\n        wxi: 'xml',\n        wxl: 'xml',\n        wxs: 'xml',\n        x3d: 'xml',\n        xacro: 'xml',\n        xaml: 'xml',\n        xib: 'xml',\n        xlf: 'xml',\n        xliff: 'xml',\n        xmi: 'xml',\n        \"xml.dist\": 'xml',\n        xproj: 'xml',\n        xsd: 'xml',\n        xul: 'xml',\n        zcml: 'xml',\n        yml: 'yaml',\n        reek: 'yaml',\n        rviz: 'yaml',\n        sublimesyntax: 'yaml',\n        syntax: 'yaml',\n        yaml: 'yaml',\n        \"yaml-tmlanguage\": 'yaml',\n    };\n    return {\n        fromExtension: function (extension) {\n            return extensionLanguages[extension];\n        }\n    };\n})();\n\n\n//# sourceURL=webpack://ExternalServices/./src/app/template-processing/monaco-languages.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app/template-processing/monaco-languages.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	ExternalServices = __webpack_exports__;
/******/ 	
/******/ })()
;