import { ExternalServices, testResultReports } from "./external-services";
import { WhenTestResultsSummeryViewModel, TestReportToSummery, WhenTestReportViewModel } from "./test-result-reports";
import {log} from "./external-services";
const boardService = ExternalServices.boardService
// import { createOrUpdateSampleTemplates } from "./adopters/template-repository";

/* eslint-disable no-undef */
const testIcon = '<path fill="currentColor" fill-rule="nonzero" d="M15,4h1V2H8V4H9v6.6L2.25,22H21.75L15,10.6Zm3.25,16H5.75L11,11.15V4h2v7.15Z"/>'
// async function makeAnExample(sourceWidget: SDK.IWidget) { // accept widgets as parameter, work on te
// 	// const selectedWidgets  = await miro.board.selection.get()
// 	// if (widgets.length != 1)
// 	// 	return
// 	// const sourceWidget = widgets[0]
// 	logger.log("SOURCE!!!!!!!!!!!!!!", sourceWidget)

// 	const exampleWidget = await miro.board.widgets.create({ type: sourceWidget.type, bounds: { x: sourceWidget.bounds.x, y: sourceWidget.bounds.y } });
// 	logger.log("EXAMPLE!!!!!!!!!!!!!!", exampleWidget)

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
	const originalWidgetText = await boardService.getWidgetText(widgetId)
	const newWidgetText = attachReportToWidgetText(vm, originalWidgetText)
	await boardService.updateWidgetText(widgetId, newWidgetText)
}
let generateBoardSection = (content: any) => {

	log.log("GeneratingBoardBasedOn:", content)
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
				log.log(e)
			}
		}, 1000)
	}
	ws.onopen = function () {
		log.log("Websocket connection opened");
	}
	ws.onclose = function () {
		log.log("Web socket closed, trying to reconnect.");
		connect()
		// ws = null;
	}
	ws.onmessage = function (evt) {
		if (evt.data && evt.data.messageType == "BoardSectionGenerated") {
			var content = evt.data.content
			generateBoardSection(content)
		}
		log.log("Summery: " + evt.data);
		var message: { id: string, testReport: WhenTestReportViewModel } = JSON.parse(evt.data)
		const summery = TestReportToSummery(message.testReport)
		log.log("Summery: " + JSON.stringify(summery));

		applyReportToWidget(message.id, summery).catch(log.log)
		// const widget = miro.board.widgets.get({ id: evt.data.id })

	}
	ws.onerror = function (evt) {
		log.log("ERROR: " + evt);
		connect()
	}
}
miro.onReady(async () => {


	// logger.log("Client Id:", miro.getClientId())3074457349056199734
	// .............................................3074457349056199734

	await boardService.interceptPossibleTextEdit(attachReportToWidgetByWidgetId)

	await miro.initialize({
		extensionPoints: {
			// getWidgetMenuItems: (widgets: SDK.IWidget[]/*, editMode: boolean*/): Promise<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]> => {

			// 	const supportedWidgetsInSelection = widgets
			// 	// .filter((widget) => Config.supported_widgets[widget.type.toLowerCase()] 
			// 	// 									!== undefined);

			// 	// All selected widgets have to be supported in order to show the menu
			// 	if (supportedWidgetsInSelection.length == widgets.length && widgets.length == 1) {
			// 		return Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{
			// 			tooltip: 'Make an Example',
			// 			svgIcon: testIcon,//Config.icon,
			// 			onClick: () => {
			// 				// miro.board.ui.openLeftSidebar('app.html')
			// 				// makeAnExample(widgets[0])
			// 				// handleAuthAndOpenWindow(openEstimateModal, widgets);
			// 			}
			// 		}])
			// 	}

			// 	// Not all selected widgets are supported, we won't show the menu
			// 	return Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{} as SDK.IWidgetMenuItem]);
			// },
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
				svgIcon: testIcon,
				onClick: () => {
					miro.board.ui.openLeftSidebar('app.html')
				}
			}
		}
	})

	// subscribeToServerEvents("ws://localhost:8080/ws")
	// createOrUpdateSampleTemplates()
})
