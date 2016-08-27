import Game from './game/Game';

const game = new Game(<HTMLCanvasElement>document.querySelector('canvas#game'));
game.onStart();

/* EVENTS */

window.onfocus = game.onResume.bind(game);
window.onresize = game.onResize.bind(game);
window.onblur = game.onPause.bind(game);