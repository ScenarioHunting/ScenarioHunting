const init = () =>
  miro.board.ui.on('icon:click', () => 
    miro.board.ui.openPanel({ url: 'app.html' }));

init();
