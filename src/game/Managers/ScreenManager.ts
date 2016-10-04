import {
  ScreenSpaceCanvas2D,
  Vector2,
} from 'babylonjs';

import Game from '../Game';
import Screen from '../Screens/Screen';
import MainMenuScreen from '../Screens/MainMenuScreen';

export default class ScreenManager {
  
  private screens: Map<string, Screen>;
  public current: Screen;

  constructor(public game: Game) {
    this.screens = new Map<string, Screen>();

    this.add('main-menu', new MainMenuScreen(game));
  }

  public add(id: string, screen: Screen): Screen {
    this.screens.set(id, screen);
    return screen;
  }

  public get(name: string): Screen {
    return this.screens.get(name);
  }

  public setCurrent(id: string): Screen {
    this.current = this.get(id);
    history.pushState(id, id);
    return this.current;
  }
}