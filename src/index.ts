import { Engine } from 'babylonjs';
import Game from './game/Game';

/* Global Styles */
require('./index.css');

/* Check For WebGL Support */
const canvas = <HTMLCanvasElement> document.getElementById('game');
const support = <HTMLElement> document.getElementById('support');

if (!Engine.isSupported()) {
  support.style.display = 'block';
  document.body.removeChild(canvas);
  throw 'Your browser does not support BabylonJS or WebGL is not enabled!';
} else {
  document.body.removeChild(support);
}

const game = new Game(canvas);
window['game'] = game;

/* EVENTS */

window.onfocus = game.onResume.bind(game);
window.onresize = game.onResize.bind(game);
window.onblur = game.onPause.bind(game);