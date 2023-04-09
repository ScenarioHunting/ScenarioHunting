const testIcon = '<path fill="currentColor" fill-rule="nonzero" d="M10,4h1V2H8V4H9v6.6L2.25,22H21.75L15,10.6Zm3.25,16H5.75L11,11.15V4h2v7.15Z"/>'

miro.onReady(async () => {

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
				title: 'Scenario Hunting',
				svgIcon: testIcon,
				onClick: () => {
					miro.board.ui.openLeftSidebar('app.html')
				}
			}
		}
	})
})
