import { singletonBoard, testResultReports } from "./global-dependency-container";
import { WhenTestResultsSummeryViewModel, TestReportToSummery, WhenTestReportViewModel } from "./test-result-reports";
/* eslint-disable no-undef */
// const icon24 = `<svg height="12" width="12">
// <text x="0" y="12" fill="currentColor">T</text>
// T
// </svg>`
//https://yqnn.github.io/svg-path-editor/
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.738 11.547 L 6.855 19.217 L 10.981 18.944 L 11.008 10.835 z z L 0.431 12.559 L 0.243 2.117 L 16.12 4.587 L 16 10 Z L 12.012 9.966 l 0.018 -2.53 l -3.073 -0.241 L 8.978 10.158 L 12.072 9.716 L 12.818 9.038 L 15.002 8.723 L 15.002 7.445 L 13.117 7.269 L 13.137 9.956 Z L 6.889 5.546 L 2.071 5.032 L 2.039 9.377 L 6.802 8.95"/>'
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.976 11.406 L 11 11 L 11 20 L 16.818 19.413 L 16.624 9.99 z z L 0.431 12.559 L 0.243 2.117 L 22.191 5.189 L 22.191 9.166 Z L 13.384 9.71 l -0.103 -3.31 l -4.511 -0.231 L 8.943 9.813 L 14.207 8.945 L 18.208 8.227 L 18.208 6.299 L 15.433 5.987 L 15.433 9.403 Z L 7.03 5.075 L 1.642 4.591 L 1.642 8.708 L 8.487 8.187"/>'
// const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.976 11.406 L 8.665 11.281 L 8.731 19.388 L 16.818 19.413 L 16.687 10.002 z z L 0.431 12.559 L 0.243 2.117 L 22.191 5.189 L 22.191 9.166 Z L 13.384 9.71 l -0.103 -3.31 l -4.511 -0.231 L 8.943 9.813 L 14.207 8.945 L 18.208 8.227 L 18.208 6.299 L 15.433 5.987 L 15.433 9.403 Z L 7.03 5.075 L 1.642 4.591 L 1.642 8.708 L 8.487 8.187"/>'
const iconT = '<path fill="currentColor" fill-rule="nonzero" d="M 20.156 7.762 M 6.738 11.547 L 6.414 21.703 L 11.954 19.53 L 12.005 10.678 z z L 0.431 12.559 L 0.243 2.117 L 16.12 4.587 L 16 10 Z L 12.012 9.966 l 0.018 -2.53 l -3.073 -0.241 L 8.978 10.158 L 12.072 9.716 L 12.818 9.038 L 15.002 8.723 L 15.002 7.445 L 13.117 7.269 L 13.137 9.956 Z L 6.889 5.546 L 2.071 5.032 L 2.039 9.377 L 6.802 8.95"/>'

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


	console.log("Client Id:", miro.getClientId())


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

	subscribeToServerEvents("ws://localhost:8080/ws")

})
