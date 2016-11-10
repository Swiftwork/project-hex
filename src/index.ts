import { Engine } from 'babylonjs';
import Game from './game/Game';

/* Global Styles */
require('./index.css');

/* Check For WebGL Support */
const canvas = <HTMLCanvasElement>document.getElementById('game');
let support = <HTMLElement>document.getElementById('support');

if (!Engine.isSupported()) {
  support.style.display = 'block';
  document.body.removeChild(canvas);
  throw 'Your browser does not support BabylonJS or WebGL is not enabled!';
} else {
  document.body.removeChild(support);
  support = null;
}

const game = new Game(canvas);

/* EVENTS */

window.addEventListener('focus', game.onResume.bind(game));
window.addEventListener('resize', game.onResize.bind(game));
window.addEventListener('blur', game.onPause.bind(game));
window.addEventListener('unload', game.onDestroy.bind(game));