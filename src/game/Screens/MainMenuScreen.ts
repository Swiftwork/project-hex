import {
  Vector2, Size,
  Engine, Scene, ScreenSpaceCanvas2D,
  Group2D, StackPanelLayoutEngine, Canvas2D, Text2D,
} from 'babylonjs';

import Game from '../Game';
import Settings from '../Logic/Settings';
import Screen from './Screen';

/* Views */
import Label2D from '../Views/Label2D';

export class MenuItem {
  title: string;
  icon?: string;
  onClick?: () => void;
}

export default class MainMenuScreen extends Screen {

  private menuItems: MenuItem[];

  constructor(public game: Game) {
    super(game);
    this.game.scene2d.backgroundFill = Canvas2D.GetSolidColorBrushFromHex("#333333FF");

    this.menuItems = [
      { title: 'Single Player', icon: Label2D.ICON.MAN, onClick: () => {
        this.game.screenManager.setCurrent('game');
      } },
      { title: 'Multi Player', icon: Label2D.ICON.BRAIN },
      { title: 'Settings', icon: Label2D.ICON.GOLD },
      { title: 'Quit', icon: Label2D.ICON.MENU },
    ]
  }

  onCreate() {
    this.createMenu(this.menuItems);
    super.onCreate();
  }

  //------------------------------------------------------------------------------------
  // INTERFACE CREATORS
  //------------------------------------------------------------------------------------

  private createMenu(menuItems: MenuItem[]): Group2D {
    const list = new Group2D({
      id: 'menu',
      parent: this.game.scene2d,
      marginAlignment: 'v: center, h: center',
      layoutEngine: StackPanelLayoutEngine.Vertical,
      children: menuItems.reverse().map(this.createMenuItem, this),
    });
    return list;
  }

  private createMenuItem(item: MenuItem, index: number): Label2D {
    const label = new Label2D(item.title, item.icon, {
      id: index.toString(),
      margin: 'top: 100px, right: 0, bottom: 100px, left: 0',
      fontName: '64pt outage',
      onClick: item.onClick,
    });
    return label;
  }
}