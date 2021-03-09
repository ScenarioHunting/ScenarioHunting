import { singletonBoard, testResultReports } from "./global-dependency-container";
import { WhenTestResultsSummeryViewModel, TestReportToSummery, WhenTestReportViewModel } from "./test-result-reports";
import { createOrUpdateSampleTemplates } from "./test-factory/template-repository";
/* eslint-disable no-undef */
// const icon24 = `<svg height="12" width="12">
// <text x="0" y="12" fill="currentColor">T</text>
// T
// </svg>`
//https://yqnn.github.io/svg-path-editor/
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.738 11.547 L 6.855 19.217 L 10.981 18.944 L 11.008 10.835 z z L 0.431 12.559 L 0.243 2.117 L 16.12 4.587 L 16 10 Z L 12.012 9.966 l 0.018 -2.53 l -3.073 -0.241 L 8.978 10.158 L 12.072 9.716 L 12.818 9.038 L 15.002 8.723 L 15.002 7.445 L 13.117 7.269 L 13.137 9.956 Z L 6.889 5.546 L 2.071 5.032 L 2.039 9.377 L 6.802 8.95"/>'
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.976 11.406 L 11 11 L 11 20 L 16.818 19.413 L 16.624 9.99 z z L 0.431 12.559 L 0.243 2.117 L 22.191 5.189 L 22.191 9.166 Z L 13.384 9.71 l -0.103 -3.31 l -4.511 -0.231 L 8.943 9.813 L 14.207 8.945 L 18.208 8.227 L 18.208 6.299 L 15.433 5.987 L 15.433 9.403 Z L 7.03 5.075 L 1.642 4.591 L 1.642 8.708 L 8.487 8.187"/>'
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.976 11.406 L 8.665 11.281 L 8.731 19.388 L 16.818 19.413 L 16.687 10.002 z z L 0.431 12.559 L 0.243 2.117 L 22.191 5.189 L 22.191 9.166 Z L 13.384 9.71 l -0.103 -3.31 l -4.511 -0.231 L 8.943 9.813 L 14.207 8.945 L 18.208 8.227 L 18.208 6.299 L 15.433 5.987 L 15.433 9.403 Z L 7.03 5.075 L 1.642 4.591 L 1.642 8.708 L 8.487 8.187"/>'
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.738 11.547 L 6.414 21.703 L 11.954 19.53 L 12.005 10.678 z z L 0.431 12.559 L 0.243 2.117 L 16.12 4.587 L 16 10 Z L 12.012 9.966 l 0.018 -2.53 l -3.073 -0.241 L 8.978 10.158 L 12.072 9.716 L 12.818 9.038 L 15.002 8.723 L 15.002 7.445 L 13.117 7.269 L 13.137 9.956 Z L 6.889 5.546 L 2.071 5.032 L 2.039 9.377 L 6.802 8.95"/>'
// const iconT = '<g><path d="M445.9,427.1L328,227.9V78c0-7.7-6.5-14-14.5-14c-8,0-14.5,6.2-14.5,14v153.6c0,1.8,0.6,3.6,1.3,5.3   c-7.6-11.1-20.6-18.4-35.4-18.4c-23.5,0-42.5,18.3-42.5,41c0,16.8,10.5,31.5,25.4,37.5h-72l35-58.5c1.2-2.1,2.1-4.5,2.1-6.9v-30.4   c4,3.2,10,5.1,16.1,5.1c15.3,0,27.5-11.9,27.5-26.6c0-14.7-12.2-26.6-27.5-26.6c-6.1,0-12.1,1.9-16.1,5.1V78c0-7.7-6.5-14-14.5-14   c-8,0-14.5,6.2-14.5,14v149.9L66.1,427.1c-2.5,4.3-2.6,9.6,0,13.9c2.6,4.3,7.2,7,12.4,7H256h177.5c5.1,0,9.8-2.6,12.4-7   C448.5,436.8,448.4,431.4,445.9,427.1z M282.2,297c14.9-6,25.4-20.8,25.4-37.5c0-5.7-1.2-11.2-3.4-16.1l31,53.6H282.2z"></path><path d="M265.1,128.6c12,0,21.7-9.4,21.7-20.9c0-11.6-9.7-20.9-21.7-20.9c-12,0-21.7,9.4-21.7,20.9   C243.3,119.2,253.1,128.6,265.1,128.6z"></path></g>'
const iconT = '<path d="M 2.761719 1.25 C 1.238281 1.25 0 3.207031 0 5.625 C 0 6.96875 0.347656 8.394531 0.691406 10.597656 C 0.960938 12.320312 1.617188 13.75 2.761719 13.75 C 3.90625 13.75 4.671875 12.796875 4.671875 11.054688 C 4.671875 10.460938 4.167969 9.515625 4.144531 8.710938 C 4.101562 7.257812 5.15625 6.675781 5.15625 5.332031 C 5.15625 2.914062 4.289062 1.25 2.761719 1.25 Z M 10.214844 6.25 C 8.691406 6.25 7.820312 7.914062 7.820312 10.332031 C 7.820312 11.675781 8.875 12.257812 8.835938 13.710938 C 8.8125 14.515625 8.304688 15.460938 8.304688 16.054688 C 8.304688 17.796875 9.074219 18.75 10.214844 18.75 C 11.359375 18.75 12.019531 17.320312 12.289062 15.597656 C 12.632812 13.394531 12.980469 11.96875 12.980469 10.625 C 12.980469 8.207031 11.742188 6.25 10.214844 6.25 Z M 10.214844 6.25 "></path>'
// const iconT = '<path d="M15,4h1V2H8V4H9v6.6L2.25,22H21.75L15,10.6Zm3.25,16H5.75L11,11.15V4h2v7.15Z"></path>'

// const icon24 = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 c -1.351 -3.746 -4.672 -5.297 -8.838 -4.61 c -3.9 0.642 -7.284 3.15 -7.9 5.736 c -1.14 4.784 -0.015 7.031 2.627 8.09 c 0.61 0.244 1.28 0.412 2.002 0.518 c 0.277 0.041 0.549 0.072 0.844 0.097 c 0.138 0.012 0.576 0.045 0.659 0.053 c 0.109 0.01 0.198 0.02 0.291 0.035 c 1.609 0.263 2.664 1.334 3.146 2.715 c 7.24 -2.435 9.4 -6.453 7.17 -12.634 z m -18.684 0.662 C 3.18 1.256 18.297 -3.284 22.038 7.084 c 2.806 7.78 -0.526 13.011 -9.998 15.695 c -0.266 0.076 -0.78 0.173 -0.759 -0.287 c 0.062 -1.296 -0.47 -2.626 -1.762 -2.837 c -1.009 -0.165 -10.75 0.124 -8.047 -11.23 M 11.567 11.256 c -0.129 1.808 -0.185 2.653 -0.25 3.86 l 2.267 -0.131 c 0.05 -0.913 0.093 -1.617 0.189 -4.349 z z L 9.155 12.152 L 9.155 5.742 L 16 7 L 16 10 Z L 12.05 9.74 l 0 -1.447 l -2.068 -0.138 L 10.051 10.498 L 12.05 9.878 L 12.808 9.119 L 14.738 8.775 L 14.738 7.534 L 13.428 7.396 L 13.428 9.119 Z"/>'
const underlineIcon = '<line x1="22" y1="22" x2="00" y2="22" stroke="currentColor" stroke-width="2"></line>'
// async function makeAnExample(sourceWidget: SDK.IWidget) { // accept widgets as parameter, work on te
// 	// const selectedWidgets  = await miro.board.selection.get()
// 	// if (widgets.length != 1)
// 	// 	return
// 	// const sourceWidget = widgets[0]
// 	console.log("SOURCE!!!!!!!!!!!!!!", sourceWidget)

// 	const exampleWidget = await miro.board.widgets.create({ type: sourceWidget.type, bounds: { x: sourceWidget.bounds.x, y: sourceWidget.bounds.y } });
// 	console.log("EXAMPLE!!!!!!!!!!!!!!", exampleWidget)

// 	// //let result = await miro.board.selection.get();
// 	// let result = widgets;
// 	// var textEdit = (await miro.board.widgets.get({ id: result[0].id }))[0]['text'];
// 	// // if (textEdit.includes("<u>")) {
// 	// textEdit = textEdit.replace("<u>", "").replace("</u>", "");
// 	// // } else {
// 	// // textEdit = textEdit 
// 	// // textEdit = "<input type='text' placeholder='" + textEdit + "'></input>"
// 	// // }
// 	// miro.board.widgets.update({
// 	// 	id: result[0]['id'],
// 	// 	text: textEdit
// 	// })
// }
const attachReportToWidgetByWidgetId = async (widgetId: string, theOriginalText: string) => {
	var vm = await testResultReports.getTestSummeryForWidget(widgetId)
	if (typeof vm == 'boolean')
		return theOriginalText
	return attachReportToWidgetText(vm, theOriginalText)
}

const attachReportToWidgetText = (vm: WhenTestResultsSummeryViewModel, theOriginalText: string) => {

	const cleanLastReport = (textIncludingReport: string): string => {
		var regex = new RegExp("<div data-section='test-summery'>.*</div>")
		const widgetAlreadyContainsAReport = regex.test(textIncludingReport)
		if (widgetAlreadyContainsAReport)
			textIncludingReport = textIncludingReport.replace(regex, "")

		textIncludingReport = textIncludingReport
			.replace(new RegExp("Failing[(]\\d+/\\d+[)]"), "")
			.replace(new RegExp("Passing[(]\\d+/\\d+[)]"), "")
			.replace(new RegExp("Skipping[(]\\d+/\\d+[)]"), "")
			.replace(new RegExp("Pending[(]\\d+/\\d+[)]"), "")
			.replace(new RegExp(`<div><span style="background-color:#de2f2f;color:#fff"> &nbsp;</span><span style="background-color:#1fab0f;color:#eff"> &nbsp;</span><span style="background-color:#f1c807;color:#046"> &nbsp;</span><span style="background-color:#199;color:#fff"> &nbsp;</span></div>`), "")
			.replace(new RegExp(`<span style="background-color:.+>.+</span>`), "")
		// "<div><span style="background-color:#de2f2f;color:#fff">  </span><span style="background-color:#1fab0f;color:#eff">  </span><span style="background-color:#f1c807;color:#046">  </span><span style="background-color:#199;color:#fff">  </span></div><div><span style="background-color:#de2f2f;color:#fff">  </span><span style="background-color:#1fab0f;color:#eff">  </span><span style="background-color:#f1c807;color:#046">  </span><span style="background-color:#199;color:#fff">  </span></div><div data-section='test-summery'><span style='background-color:#de2f2f;color:#fff'> Failing(0/1) </span><span style='background-color:#1fab0f;color:#eff'> Passing(1/1) </span><span style='background-color:#f1c807;color:#046'> Skipping(0/1) </span><span style='background-color:#199;color:#fff'> Pending(0/1) </span></div>"
		return textIncludingReport
	}
	theOriginalText = cleanLastReport(theOriginalText)

	var reportComponent = "<div data-section='test-summery'>" +
		"<span style='background-color:#de2f2f;color:#fff'> Failing(" + vm.failed + "/" + vm.total + ") </span>" +
		"<span style='background-color:#1fab0f;color:#eff'> Passing(" + vm.passed + "/" + vm.total + ") </span>" +
		"<span style='background-color:#f1c807;color:#046'> Skipping(" + vm.skipped + "/" + vm.total + ") </span>" +
		"<span style='background-color:#199;color:#fff'> Pending(" + vm.pending + "/" + vm.total + ") </span>" +
		"</div>"

	return theOriginalText + reportComponent
}
const applyReportToWidget = async (widgetId: string, vm: WhenTestResultsSummeryViewModel) => {
	const originalWidgetText = await singletonBoard.getWidgetText(widgetId)
	const newWidgetText = attachReportToWidgetText(vm, originalWidgetText)
	await singletonBoard.updateWidgetText(widgetId, newWidgetText)
}
let generateBoardSection = (content: any) => {

	console.log("GeneratingBoardBasedOn:", content)
}
let subscribeToServerEvents = (webSocketUrl: string) => {
	let ws = new WebSocket(webSocketUrl)
	function connect() {
		var reconnectionTimer = setInterval(() => {
			try {
				ws = new WebSocket(webSocketUrl)
				clearInterval(reconnectionTimer)
			}
			catch (e) {
				console.log(e)
			}
		}, 1000)
	}
	ws.onopen = function () {
		console.log("Websocket connection opened");
	}
	ws.onclose = function () {
		console.log("Web socket closed, trying to reconnect.");
		connect()
		// ws = null;
	}
	ws.onmessage = function (evt) {
		if (evt.data && evt.data.messageType == "BoardSectionGenerated") {
			var content = evt.data.content
			generateBoardSection(content)
		}
		console.log("Summery: " + evt.data);
		var message: { id: string, testReport: WhenTestReportViewModel } = JSON.parse(evt.data)
		const summery = TestReportToSummery(message.testReport)
		console.log("Summery: " + JSON.stringify(summery));

		applyReportToWidget(message.id, summery).catch(console.log)
		// const widget = miro.board.widgets.get({ id: evt.data.id })

	}
	ws.onerror = function (evt) {
		console.log("ERROR: " + evt);
		connect()
	}
}
miro.onReady(async () => {


	// console.log("Client Id:", miro.getClientId())3074457349056199734
	// .............................................3074457349056199734

	await singletonBoard.interceptPossibleTextEdit(attachReportToWidgetByWidgetId)

	await miro.initialize({
		extensionPoints: {
			getWidgetMenuItems: (widgets: SDK.IWidget[]/*, editMode: boolean*/): Promise<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]> => {

				const supportedWidgetsInSelection = widgets
				// .filter((widget) => Config.supported_widgets[widget.type.toLowerCase()] 
				// 									!== undefined);

				// All selected widgets have to be supported in order to show the menu
				if (supportedWidgetsInSelection.length == widgets.length && widgets.length == 1) {
					return Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{
						tooltip: 'Make an Example',
						svgIcon: underlineIcon,//Config.icon,
						onClick: () => {
							// miro.board.ui.openLeftSidebar('sidebar.html')
							// makeAnExample(widgets[0])
							// handleAuthAndOpenWindow(openEstimateModal, widgets);
						}
					}])
				}

				// Not all selected widgets are supported, we won't show the menu
				return Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{} as SDK.IWidgetMenuItem]);
			},
			// exportMenu: {
			// 	title: 'Boilerplate export',
			// 	svgIcon: icon24,
			// 	onClick: () => {
			// 		// Remember that 'modal.html' resolves relative to main.js file. So modal.html have to be in the /dist/ folder.
			// 		miro.board.ui.openModal('modal.html')
			// 	}
			// },
			bottomBar: {
				title: 'Context Reflective Test',
				svgIcon: iconT,
				onClick: () => {
					miro.board.ui.openLeftSidebar('sidebar.html')
				}
			}
		}
	})

	// subscribeToServerEvents("ws://localhost:8080/ws")
	createOrUpdateSampleTemplates()
})
