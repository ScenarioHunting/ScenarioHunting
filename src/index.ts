import { singletonBoard, testResultReports } from "./global-dependency-container";
import { WhenTestResultsSummeryViewModel, TestReportToSummery, WhenTestReportViewModel } from "./test-result-reports";




/* eslint-disable no-undef */
const icon24 = '<path fill="currentColor" fill-rule="nonzero" d="M20.156 7.762c-1.351-3.746-4.672-5.297-8.838-4.61-3.9.642-7.284 3.15-7.9 5.736-1.14 4.784-.015 7.031 2.627 8.09.61.244 1.28.412 2.002.518.277.041.549.072.844.097.138.012.576.045.659.053.109.01.198.02.291.035 1.609.263 2.664 1.334 3.146 2.715 7.24-2.435 9.4-6.453 7.17-12.634zm-18.684.662C3.18 1.256 18.297-3.284 22.038 7.084c2.806 7.78-.526 13.011-9.998 15.695-.266.076-.78.173-.759-.287.062-1.296-.47-2.626-1.762-2.837-1.009-.165-10.75.124-8.047-11.23zm9.427 4.113a6.853 6.853 0 0 0 1.787.172c.223.348.442.733.79 1.366.53.967.793 1.412 1.206 2a1 1 0 1 0 1.636-1.15c-.358-.51-.593-.908-1.09-1.812-.197-.36-.358-.649-.503-.899 1.16-.573 1.916-1.605 2.005-2.909.189-2.748-2.65-4.308-6.611-3.267-.443.117-.834.44-.886 1.408-.065 1.192-.12 2.028-.25 3.825-.129 1.808-.185 2.653-.25 3.86a1 1 0 0 0 1.997.108c.05-.913.093-1.617.17-2.702zm.144-2.026c.077-1.106.124-1.82.171-2.675 2.398-.483 3.595.257 3.521 1.332-.08 1.174-1.506 1.965-3.692 1.343z"/>'
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
				title: 'Boilerplate bottomBar',
				svgIcon: icon24,
				onClick: () => {
					miro.board.ui.openLeftSidebar('sidebar.html')
				}
			}
		}
	})
	// // <Init>
	// var role = "CRT.Templates"
	// // eslint-disable-next-line no-undef
	// var widgets = await miro.board.widgets.get({
	// 	"metadata": {
	// 		[miro.getClientId()]: {
	// 			"role": role,
	// 		}
	// 	}
	// })
	// widgets.forEach(w => {
	// 	w.clientVisible = false
	// 	// eslint-disable-next-line no-undef
	// 	miro.board.widgets.update(w)
	// })
	// // </Init>
	subscribeToServerEvents("ws://localhost:8080/ws")

})
