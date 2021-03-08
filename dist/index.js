(()=>{"use strict";var e=function(e,t,n,i){return new(n||(n=Promise))((function(o,l){function r(e){try{a(i.next(e))}catch(e){l(e)}}function s(e){try{a(i.throw(e))}catch(e){l(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}a((i=i.apply(e,t||[])).next())}))};function t(t){return e(this,void 0,void 0,(function*(){const e=yield miro.board.widgets.get({id:t.startWidgetId});return 0==e.length&&(yield miro.showNotification("Examples should be connected to a fact they belong to.")),e[0]}))}function n(e){return e?"text"in e?e.text:"captions"in e&&e.captions&&e.captions[0]&&e.captions[0].text?Promise.resolve(e.captions[0].text):Promise.reject("Cannot get the widget text. The widget has no text fields."):Promise.reject("Cannot get the widget text. The widget is undefined.")}function i(e,t){const n=e;if("text"in e)n.text=t;else{if(!("captions"in e))return Promise.reject("Cannot set the widget text. The widget has no text fields.");n.captions[0].text=t}return Promise.resolve(n)}let o=new class{constructor(){this.unselectAll=()=>e(this,void 0,void 0,(function*(){miro&&miro.board||(yield new Promise((e=>setTimeout(e,200)))),yield miro.board.selection.clear()})),this.showNotification=e=>miro.showNotification(e),this.zoomTo=e=>miro.board.viewport.zoomToObject(e.id,!0)}openModal(e){throw miro.board.ui.openModal(e,{width:50,height:50}),new Error("Method not implemented.")}onWidgetLeft(t){miro.addListener("SELECTION_UPDATED",(n=>e(this,void 0,void 0,(function*(){var e=n.data;this.previouslySelectedWidgets||(this.previouslySelectedWidgets=e),this.previouslySelectedWidgets.forEach((e=>t(e.id))),this.previouslySelectedWidgets=e}))))}interceptPossibleTextEdit(t){miro.addListener("SELECTION_UPDATED",(o=>e(this,void 0,void 0,(function*(){var l=o.data;this.previouslySelectedWidgets||(this.previouslySelectedWidgets=l),this.previouslySelectedWidgets.forEach((o=>e(this,void 0,void 0,(function*(){let e=(yield miro.board.widgets.get({id:o.id}))[0];const l=yield n(e),r=yield t(e.id,l);e=yield i(e,r),r!=l&&(yield miro.board.widgets.update([e]))})))),this.previouslySelectedWidgets=l}))))}getWidgetText(t){return e(this,void 0,void 0,(function*(){console.log("Finding widget by id:"+t);var e=(yield miro.board.widgets.get({id:t}))[0];return yield n(e)}))}updateWidgetText(t,n){return e(this,void 0,void 0,(function*(){let e=(yield miro.board.widgets.get({id:t}))[0];e=yield i(e,n),yield miro.board.widgets.update([e])}))}onNextSingleSelection(i){console.log("Waiting for the next single selection!");const o=l=>e(this,void 0,void 0,(function*(){var r=l.data;if(0!=r.length)if(console.log("Selected."),r.length>1)console.log(`${r.length} items are selected. Only a single one can be selected.`);else{console.log("Getting the widget.");var s=(yield miro.board.widgets.get({id:r[0].id}))[0];console.log("Converting the widget"),function(i){return e(this,void 0,void 0,(function*(){var o={id:i.id,exampleWidget:i};o.abstractionWidget=yield function(n){return e(this,void 0,void 0,(function*(){const i=yield function(t){return e(this,void 0,void 0,(function*(){return(yield(yield miro.board.widgets.get({type:"LINE",endWidgetId:t.id})).map((e=>e))).filter((e=>0!=e.style.lineEndStyle))}))}(n);if(0===i.length)return Promise.resolve(n);const o=yield Promise.all(i.map(t));if(o.length>1){const e="Examples can not belong to more than one abstraction (only one incoming line).";return yield miro.showNotification(e),Promise.reject(e)}return Promise.resolve(o[0])}))}(o.exampleWidget),console.log("Selection dto initiated.",o),o.style=function(e){const t={};return e.style&&e.style.backgroundColor?(console.log("Setting style:",e.style.backgroundColor),t.backgroundColor=e.style.backgroundColor):e.style&&e.style.stickerBackgroundColor&&(console.log("Setting style:",e.style.stickerBackgroundColor),t.backgroundColor=e.style.stickerBackgroundColor),t}(i);try{const e=e=>e.split("</p><p>").join("\n").replace("<p>","").replace("</p>","").replace("&#43;","+");o.exampleText=e(yield n(i))}catch(e){return Promise.reject("The widget "+JSON.stringify(i)+" does not have any text.")}console.log("Widget text converted by board.:",o.exampleText);try{return{widgetSnapshot:o,widgetData:yield function(e){return t=this,n=void 0,o=function*(){const t=e.split("\n");let n=t.shift();if(!n)return Promise.reject("Unknown text format.");const i=e=>e.trim().replace(/([^A-Z0-9]+)(.)/gi,(function(){return arguments[2].toUpperCase()}));n=i(n);const o=t.map((e=>e.split(":"))).map((e=>({propertyName:i(e[0]),simplePropertyValue:e[1].trim()})));return Promise.resolve({type:n,properties:o})},new((i=void 0)||(i=Promise))((function(e,l){function r(e){try{a(o.next(e))}catch(e){l(e)}}function s(e){try{a(o.throw(e))}catch(e){l(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(r,s)}a((o=o.apply(t,n||[])).next())}));var t,n,i,o}(o.exampleText)}}catch(e){return miro.showNotification(e),Promise.reject(e)}}))}(s).then((e=>{console.log(e),i(e),miro.removeListener("SELECTION_UPDATED",o)})).catch(console.log)}}));return miro.addListener("SELECTION_UPDATED",o)}},l=new class{constructor(){this.getTestSummeryForWidget=e=>{return t=this,n=void 0,o=function*(){const t=(yield miro.board.widgets.get({id:e}))[0];return!!(t&&t.metadata[miro.getClientId()]&&t.metadata[miro.getClientId()].testReport&&t.metadata[miro.getClientId()].testReport)&&(n=t.metadata[miro.getClientId()].testReport,{total:(null!==(i=n.passed)&&void 0!==i?i:[]).length+(null!==(o=n.failed)&&void 0!==o?o:[]).length+(null!==(l=n.pending)&&void 0!==l?l:[]).length+(null!==(r=n.skipped)&&void 0!==r?r:[]).length,passed:(null!==(s=n.passed)&&void 0!==s?s:[]).length,failed:(null!==(a=n.failed)&&void 0!==a?a:[]).length,skipped:(null!==(d=n.skipped)&&void 0!==d?d:[]).length,pending:(null!==(c=n.pending)&&void 0!==c?c:[]).length});var n,i,o,l,r,s,a,d,c},new((i=void 0)||(i=Promise))((function(e,l){function r(e){try{a(o.next(e))}catch(e){l(e)}}function s(e){try{a(o.throw(e))}catch(e){l(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(r,s)}a((o=o.apply(t,n||[])).next())}));var t,n,i,o}}};var r=function(e,t,n,i){return new(n||(n=Promise))((function(o,l){function r(e){try{a(i.next(e))}catch(e){l(e)}}function s(e){try{a(i.throw(e))}catch(e){l(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}a((i=i.apply(e,t||[])).next())}))};class s{getAllTemplateNames(){return r(this,void 0,void 0,(function*(){return(yield this.findAllTemplateWidgets()).map((e=>(console.log("template:"+e.metadata[miro.getClientId()].templateName+"found!"),e.metadata[miro.getClientId()].templateName)))}))}removeTemplate(e){return r(this,void 0,void 0,(function*(){(yield this.findWidgetByTemplateName(e)).forEach((e=>r(this,void 0,void 0,(function*(){return yield miro.board.widgets.deleteById(e.id)}))))}))}createOrReplaceTemplate(e){return r(this,void 0,void 0,(function*(){console.log("createOrReplaceTemplate:"),console.log("finding widget for template:",e.templateName);var t=yield this.findWidgetByTemplateName(e.templateName);if(console.log(`${t.length} widgets found for template with name: ${e.templateName}`),0==t.length){console.log("Creating template:",e);const t=yield miro.board.viewport.get();yield miro.board.widgets.create({type:"TEXT",text:e.codeTemplate,metadata:{[miro.getClientId()]:e},capabilities:{editable:!1},style:{textAlign:"l"},x:t.x-200,y:t.y-200}),console.log(`template: ${e.templateName} is created successfully.`)}else{console.log("Updating template:",e);var n=t[0];n.test=e.codeTemplate,n.metadata[miro.getClientId()]=e,yield miro.board.widgets.update(n),console.log(`template:${e.templateName} is updated successfully.`)}}))}findAllTemplateWidgets(){return r(this,void 0,void 0,(function*(){var e=(yield miro.board.widgets.get()).filter((e=>"STICKER"==e.type&&e.text.includes("using")));return console.log("# of widgets contain using in their text:",e.length),(yield miro.board.widgets.get()).filter((e=>e.metadata&&e.metadata["3074457349056199734"]&&e.metadata["3074457349056199734"]&&e.metadata["3074457349056199734"].templateName))}))}findWidgetByTemplateName(e){return r(this,void 0,void 0,(function*(){return(yield this.findAllTemplateWidgets()).filter((t=>t.metadata[miro.getClientId()].templateName==e))}))}getTemplateByName(e){return r(this,void 0,void 0,(function*(){var t=yield this.findWidgetByTemplateName(e);if(0==t.length)throw new Error("Widget not found for template:"+e);return t[0].metadata[miro.getClientId()]}))}}var a=function(e,t,n,i){return new(n||(n=Promise))((function(o,l){function r(e){try{a(i.next(e))}catch(e){l(e)}}function s(e){try{a(i.throw(e))}catch(e){l(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}a((i=i.apply(e,t||[])).next())}))};const d=(e,t)=>a(void 0,void 0,void 0,(function*(){var n=yield l.getTestSummeryForWidget(e);return"boolean"==typeof n?t:c(n,t)})),c=(e,t)=>{var n,i;return n=t,(i=new RegExp("<div data-section='test-summery'>.*</div>")).test(n)&&(n=n.replace(i,"")),(t=n=n.replace(new RegExp("Failing[(]\\d+/\\d+[)]"),"").replace(new RegExp("Passing[(]\\d+/\\d+[)]"),"").replace(new RegExp("Skipping[(]\\d+/\\d+[)]"),"").replace(new RegExp("Pending[(]\\d+/\\d+[)]"),"").replace(new RegExp('<div><span style="background-color:#de2f2f;color:#fff"> &nbsp;</span><span style="background-color:#1fab0f;color:#eff"> &nbsp;</span><span style="background-color:#f1c807;color:#046"> &nbsp;</span><span style="background-color:#199;color:#fff"> &nbsp;</span></div>'),"").replace(new RegExp('<span style="background-color:.+>.+</span>'),""))+"<div data-section='test-summery'><span style='background-color:#de2f2f;color:#fff'> Failing("+e.failed+"/"+e.total+") </span><span style='background-color:#1fab0f;color:#eff'> Passing("+e.passed+"/"+e.total+") </span><span style='background-color:#f1c807;color:#046'> Skipping("+e.skipped+"/"+e.total+") </span><span style='background-color:#199;color:#fff'> Pending("+e.pending+"/"+e.total+") </span></div>"};miro.onReady((()=>a(void 0,void 0,void 0,(function*(){yield o.interceptPossibleTextEdit(d),yield miro.initialize({extensionPoints:{getWidgetMenuItems:e=>e.length==e.length&&1==e.length?Promise.resolve([{tooltip:"Make an Example",svgIcon:'<line x1="22" y1="22" x2="00" y2="22" stroke="currentColor" stroke-width="2"></line>',onClick:()=>{}}]):Promise.resolve([{}]),bottomBar:{title:"Context Reflective Test",svgIcon:'<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.738 11.547 L 6.414 21.703 L 11.954 19.53 L 12.005 10.678 z z L 0.431 12.559 L 0.243 2.117 L 16.12 4.587 L 16 10 Z L 12.012 9.966 l 0.018 -2.53 l -3.073 -0.241 L 8.978 10.158 L 12.072 9.716 L 12.818 9.038 L 15.002 8.723 L 15.002 7.445 L 13.117 7.269 L 13.137 9.956 Z L 6.889 5.546 L 2.071 5.032 L 2.039 9.377 L 6.802 8.95"/>',onClick:()=>{miro.board.ui.openLeftSidebar("sidebar.html")}}}}),function(){r(this,void 0,void 0,(function*(){var e=new s;yield function(e){return r(this,void 0,void 0,(function*(){const t=[{testFileNameTemplate:"{{scenario}}",testFileExtension:"cs",codeTemplate:'using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n    {{#* inline "callConstructor"}}\n    new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\n    public class {{scenario}} : IStorySpecification\n    {\n        public IDomainEvent[] Given\n        => new IDomainEvent[]{\n    {{#each givens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n        public ICommand When\n        => {{> callConstructor when}};\n        public IDomainEvent[] Then\n        => new IDomainEvent[]{\n    {{#each thens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n\n        public string Sut { get; } = nameof({{sut}});\n\n        [Fact]\n        public void Run()\n        => TestAdapter.Test(this\n                , setupUseCases: eventStore =>\n                        new[] {\n                        new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                        });\n    }\n}',templateName:"sample-template"},{testFileNameTemplate:"{{scenario}}2",testFileExtension:"cs",codeTemplate:'using StoryTest;\nusing Vlerx.Es.Messaging;\nusing Vlerx.Es.Persistence;\nusing Vlerx.SampleContracts.{{sut}};\nusing Vlerx.{{context}}.{{sut}};\nusing Vlerx.{{context}}.{{sut}}.Commands;\nusing Vlerx.{{context}}.Tests.StoryTests;\nusing Xunit;\n\nnamespace {{context}}.Tests\n{\n    {{#* inline "callConstructor"}}\n    new {{title}}({{#each properties}}"{{example}}"{{#skipLast}},{{/skipLast}}{{/each}}){{/inline}}\n\n    public class {{scenario}} : IStorySpecification\n    {\n        public IDomainEvent[] Given\n        => new IDomainEvent[]{\n    {{#each givens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n        public ICommand When\n        => {{> callConstructor when}};\n        public IDomainEvent[] Then\n        => new IDomainEvent[]{\n    {{#each thens}}\n        {{> callConstructor .}},\n    {{/each}}\n        };\n\n        public string Sut { get; } = nameof({{sut}});\n\n        [Fact]\n        public void Run()\n        => TestAdapter.Test(this\n                , setupUseCases: eventStore =>\n                        new[] {\n                        new {{sut}}UseCases(new Repository<{{sut}}.State>(eventStore))\n                        });\n    }\n}',templateName:"sample-template2"}];for(var n=0;n<t.length;n++)yield e.createOrReplaceTemplate(t[n])}))}(e)}))}()}))))})();