const testIcon = '<path fill="currentColor" fill-rule="nonzero" d="M10,4h1V2H8V4H9v6.6L2.25,22H21.75L15,10.6Zm3.25,16H5.75L11,11.15V4h2v7.15Z"/>'

async function init() {
	miro.board.ui.on("icon:click", async () => {
		await miro.board.ui.openPanel({ url: 'app.html' })
	})
}