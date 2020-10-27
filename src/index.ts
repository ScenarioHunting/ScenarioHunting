/* eslint-disable no-undef */
const icon24 = '<path fill="currentColor" fill-rule="nonzero" d="M20.156 7.762c-1.351-3.746-4.672-5.297-8.838-4.61-3.9.642-7.284 3.15-7.9 5.736-1.14 4.784-.015 7.031 2.627 8.09.61.244 1.28.412 2.002.518.277.041.549.072.844.097.138.012.576.045.659.053.109.01.198.02.291.035 1.609.263 2.664 1.334 3.146 2.715 7.24-2.435 9.4-6.453 7.17-12.634zm-18.684.662C3.18 1.256 18.297-3.284 22.038 7.084c2.806 7.78-.526 13.011-9.998 15.695-.266.076-.78.173-.759-.287.062-1.296-.47-2.626-1.762-2.837-1.009-.165-10.75.124-8.047-11.23zm9.427 4.113a6.853 6.853 0 0 0 1.787.172c.223.348.442.733.79 1.366.53.967.793 1.412 1.206 2a1 1 0 1 0 1.636-1.15c-.358-.51-.593-.908-1.09-1.812-.197-.36-.358-.649-.503-.899 1.16-.573 1.916-1.605 2.005-2.909.189-2.748-2.65-4.308-6.611-3.267-.443.117-.834.44-.886 1.408-.065 1.192-.12 2.028-.25 3.825-.129 1.808-.185 2.653-.25 3.86a1 1 0 0 0 1.997.108c.05-.913.093-1.617.17-2.702zm.144-2.026c.077-1.106.124-1.82.171-2.675 2.398-.483 3.595.257 3.521 1.332-.08 1.174-1.506 1.965-3.692 1.343z"/>'
const underlineIcon = '<line x1="22" y1="22" x2="00" y2="22" stroke="currentColor" stroke-width="2"></line>'
async function underline(widgets: SDK.IWidget[]) { // accept widgets as parameter, work on te
	//let result = await miro.board.selection.get();
	let result = widgets;
	var textEdit = (await miro.board.widgets.get({ id: result[0].id }))[0]['text'];
	// if (textEdit.includes("<u>")) {
	textEdit = textEdit.replace("<u>", "").replace("</u>", "");
	// } else {
	// textEdit = textEdit 
	// textEdit = "<input type='text' placeholder='" + textEdit + "'></input>"
	// }
	miro.board.widgets.update({
		id: result[0]['id'],
		text: textEdit
	})
}
type WhenTestResultsSummeryViewModel = {
	// boardId string?
	Total: number
	Passed: number
	Failed: number
	Pending: number
	Skipped: number

	Example: any
}

miro.onReady(async () => {
	await miro.addListener("SELECTION_UPDATED", async x => {
		if (!x
			|| !x.data
			|| x.data.length != 1
			|| !x.data[0]
			|| !x.data[0].metadata
			|| !x.data[0].metadata["3074457349056199734"]
			|| !(x.data[0].metadata["3074457349056199734"] as WhenTestResultsSummeryViewModel))
			return;

		const vm = (x.data[0].metadata["3074457349056199734"] as WhenTestResultsSummeryViewModel);
		const widgetId = x.data[0].id
		const widget = await miro.board.widgets.get(widgetId)[0]
		//vm.metadata["3074457349056199734"].testSummery.failed
		var strReportSummery = "<div id='test-summery'>" +
			"<span style='background-color:red'>" + vm.Failed + "</span>" +
			"<span style='background-color:green'>" + vm.Passed + "</span>" +
			"<span style='background-color:yellow'>" + vm.Skipped + "</span>" +
			"<span style='background-color:lightblue'>" + vm.Pending + "</span>" +
			"</div>"
		var regex = new RegExp("<div id='test-summery'>(.*)<\/div>")
		//TODO: map the widget into a local struct so that text vs plain text vs value,.. does not tie the app to the board
		if (regex.test(widget.text)) {
			widget.text = widget.text.replace(regex, strReportSummery)
		}
		else {
			widget.text += strReportSummery
		}
		delete widget.metadata

		miro.board.widgets.update([widget])
		//"<span style='background-color:red'> ccc </span>"
		// "<div id='test-summery'><span style='background-color:red'>1</span><span style='background-color:green'>1</span><span style='background-color:yellow'>1</span><span style='background-color:lightblue'>1</span></div>".replace( new RegExp("<div id='test-summery'>(.*)<\/div>"),"<div id='test-summery'><span style='background-color:red'>1</span><span style='background-color:green'>1</span><span style='background-color:yellow'>1</span><span style='background-color:lightblue'>9</span></div>")
		// w.text = w.text.replace("<div id='test-summery'>.*<\/div>","<div id='test-summery'><span style='background-color:red'>1</span><span style='background-color:green'>1</span><span style='background-color:yellow'>2</span><span style='background-color:lightblue'>1</span></div>")
		//new RegExp("<div id='test-summery'>(.*)<\/div>").exec("<div id='test-summery'><span style='background-color:red'>1</span><span style='background-color:green'>1</span><span style='background-color:yellow'>1</span><span style='background-color:lightblue'>9</span></div>")[0]
		// "<div id='test-summery'><span style='background-color:red'>1</span><span style='background-color:green'>1</span><span style='background-color:yellow'>1</span><span style='background-color:lightblue'>9</span></div>"
		//delete vm.metadata
		// miro.board.widgets.update([vm])
	})
	await miro.initialize({
		extensionPoints: {
			getWidgetMenuItems: (widgets: SDK.IWidget[]/*, editMode: boolean*/): Promise<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]> => {

				const supportedWidgetsInSelection = widgets
				// .filter((widget) => Config.supported_widgets[widget.type.toLowerCase()] 
				// 									!== undefined);

				// All selected widgets have to be supported in order to show the menu
				if (supportedWidgetsInSelection.length == widgets.length) {
					return Promise.resolve<SDK.IWidgetMenuItem | SDK.IWidgetMenuItem[]>([{
						tooltip: 'Exercise SUT',
						svgIcon: underlineIcon,//Config.icon,
						onClick: () => {
							// miro.board.ui.openLeftSidebar('sidebar.html')
							underline(widgets)
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
})
