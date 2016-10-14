import {
  Vector2,
  ScreenSpaceCanvas2D,
  Animation,
} from 'babylonjs';

import Game from '../Game';
import Screen from '../Screens/Screen';

/* SCREENS */
import MainMenuScreen from '../Screens/MainMenuScreen';
import GameScreen from '../Screens/GameScreen';

export default class ScreenManager {

  private screens: Map<string, Screen>;

  /* STATE */
  public activeScreen: Screen;

  /* ANIMATIONS */
  public fadeOut: Animation;
  public fadeIn: Animation;
  public fadeDuration = 2000;

  constructor(private game: Game) {
    this.screens = new Map<string, Screen>();

    /* Fade Animation */
    const frames = this.fadeDuration / 1000 / 2 * 60;
    this.fadeOut = new Animation('fade', 'opacity', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT, false);
    this.fadeIn = this.fadeOut.clone();
    this.fadeOut.setKeys([{ frame: 0, value: 1 }, { frame: frames, value: 0 }]);
    this.fadeIn.setKeys([{ frame: 0, value: 0 }, { frame: frames, value: 1 }]);

    /* Screen */
    this.add('main-menu', new MainMenuScreen(game, 'main-menu'));
    this.add('game', new GameScreen(game, 'game'));
  }

  public add(id: string, screen: Screen): Screen {
    this.screens.set(id, screen);
    screen.screen.levelVisible = false;
    return screen;
  }

  public get(name: string): Screen {
    return this.screens.get(name);
  }

  public show(id: string): Screen {
    const previousScreen = this.activeScreen;
    this.activeScreen = this.get(id);
    history.pushState(id, id);

    /* Fade Transition */
    if (previousScreen) {
      previousScreen.screen.zOrder = 1;
      this.activeScreen.screen.zOrder = 0;
      this.activeScreen.onCreate();

      const frames = this.fadeDuration / 1000 / 2 * 60;
      previousScreen.screen.animations.push(this.fadeOut);
      this.game.scene.beginAnimation(previousScreen.screen, 0, frames, false, 1, () => {
        previousScreen.onPause();
        previousScreen.screen.levelVisible = false;
        // this.activeScreen.screen.animations.push(this.fadeIn);
        // this.game.scene.beginAnimation(this.activeScreen.screen, 0, frames, false, 1);
      })
    } else {
      this.activeScreen.onCreate();
    }

    return this.activeScreen;
  }
}