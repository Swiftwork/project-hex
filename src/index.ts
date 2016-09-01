import { Engine } from 'babylonjs';
import Game from './game/Game';

if (!Engine.isSupported()) {
	(<HTMLElement>document.querySelector('h1#support')).style.display = 'block';
	document.querySelector('canvas#game').remove();
	throw 'Your browser does not support BabylonJS or WebGL is not enabled!';
} else {
	document.querySelector('h1#support').remove();
}

const game = new Game(<HTMLCanvasElement>document.querySelector('canvas#game'));
window['game'] = game;

/* EVENTS */

window.onfocus = game.onResume.bind(game);
window.onresize = game.onResize.bind(game);
window.onblur = game.onPause.bind(game);