import {
  Vector2, Size,
  Engine, Scene, ScreenSpaceCanvas2D, Texture,
  Group2D, StackPanelLayoutEngine, Canvas2D, Text2D, Rectangle2D, Sprite2D,
} from 'babylonjs';

import Game from '../Game';
import Settings from '../Utils/Settings';
import Screen from './Screen';

/* Views */
import Label2D from '../Canvas2D/Label2D';

export class MenuItem {
  title: string;
  icon?: string;
  onClick?: () => void;
}

export default class MainMenuScreen extends Screen {

  private menuItems: MenuItem[];

  private fullscreen: Label2D;

  constructor(public game: Game, public id: string) {
    super(game, id);
    //this.screen.fill = Canvas2D.GetSolidColorBrushFromHex("#202020FF");

    const hexagons = <Texture>this.game.assetManager.get('interface-hexagon-pattern');
    hexagons.hasAlpha = true;

    let background = new Sprite2D(hexagons, {
      id: 'background',
      parent: this.screen,
      marginAlignment: 'v: stretch, h: stretch',
      opacity: 0.01,
    });
    background.texture.wrapU = background.texture.wrapV = 1;

    this.menuItems = [

      { title: 'Continue', icon: Label2D.ICON.BRAIN },
      {
        title: 'New Battle', icon: Label2D.ICON.MAN, onClick: () => {
          this.game.screenManager.show('game');
        }
      },
      { title: 'Multi Player', icon: Label2D.ICON.BRAIN },
      { title: 'Settings', icon: Label2D.ICON.GOLD },
      { title: 'Quit', icon: Label2D.ICON.MENU },
    ]
  }

  onCreate() {
    super.onCreate();
    this.createMenu(this.menuItems);
    this.createFullscreen();
  }

  //------------------------------------------------------------------------------------
  // INTERFACE CREATORS
  //------------------------------------------------------------------------------------

  private createMenu(menuItems: MenuItem[]): Group2D {
    const list = new Group2D({
      id: 'menu',
      parent: this.screen,
      marginAlignment: 'v: center, h: center',
      layoutEngine: StackPanelLayoutEngine.Vertical,
      children: menuItems.reverse().map(this.createMenuItem, this),
    });
    return list;
  }

  private createMenuItem(item: MenuItem, index: number): Label2D {
    const label = new Label2D(item.title, item.icon, {
      id: index.toString(),
      marginBottom: this.game.graphics.dpToPx(50),
      fontName: `${this.game.graphics.dpToPx(32)}px outage`,
      onClick: item.onClick,
    });
    return label;
  }

  private createFullscreen() {
    this.fullscreen = new Label2D('', Label2D.ICON.EXPAND, {
      id: 'fullscreen',
      parent: this.screen,
      marginAlignment: 'v: top, h: right',
      marginTop: this.game.graphics.dpToPx(25),
      marginRight: this.game.graphics.dpToPx(25),
      fontName: `${this.game.graphics.dpToPx(32)}px outage`,
      onClick: () => {
        this.game.graphics.switchFullscreen();
      }
    });
  }
}
