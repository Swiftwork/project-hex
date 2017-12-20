import { Texture } from 'babylonjs';

import Game from '../Game';
import Label from '../Gui/Label';
import Screen from './Screen';
import { StackPanel } from 'babylonjs-gui';

/* Views */
export class MenuItem {
  title: string;
  icon?: string;
  onClick?: () => void;
}

export default class MainMenuScreen extends Screen {

  private menuItems: MenuItem[];

  private fullscreen: Label;

  constructor(public game: Game, public id: string) {
    super(game, id);
    //this.screen.fill = Canvas2D.GetSolidColorBrushFromHex("#202020FF");

    const hexagons = <Texture>this.game.assetManager.get('interface-hexagon-pattern');
    hexagons.hasAlpha = true;
    /*
    let background = new Sprite2D(hexagons, {
      id: 'background',
      parent: this.screen,
      marginAlignment: 'v: stretch, h: stretch',
      opacity: 0.01,
    });
    background.texture.wrapU = background.texture.wrapV = 1;
    */

    this.menuItems = [

      { title: 'Continue', icon: Label.ICON.BRAIN },
      {
        title: 'New Battle', icon: Label.ICON.MAN, onClick: () => {
          this.game.screenManager.show('game');
        }
      },
      { title: 'Multi Player', icon: Label.ICON.BRAIN },
      { title: 'Settings', icon: Label.ICON.GOLD },
      { title: 'Quit', icon: Label.ICON.MENU },
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

  private createMenu(menuItems: MenuItem[]): StackPanel {
    const list = new StackPanel('menu')
    menuItems.reverse().forEach((item, index) => {
      list.addControl(this.createMenuItem(item, index));
    });
    /*
    {
      id: 'menu',
      parent: this.screen,
      marginAlignment: 'v: center, h: center',
      layoutEngine: StackPanelLayoutEngine.Vertical,
      children: menuItems.reverse().map(this.createMenuItem, this),
    });
    */
    return list;
  }

  private createMenuItem(item: MenuItem, index: number): Label {
    const label = new Label(`menu-item-${index.toString()}`, item.title, item.icon)
    label.onPointerDownObservable.add(item.onClick)
    /*
    {
      id: index.toString(),
      marginBottom: this.game.graphics.dpToPx(50),
      fontName: `${this.game.graphics.dpToPx(32)}px outage`,
      onClick: item.onClick,
    });
    */
    return label;
  }

  private createFullscreen() {
    this.fullscreen = new Label('fullscreen', '', Label.ICON.EXPAND);
    this.fullscreen.onPointerDownObservable.add(() => {
      this.game.graphics.switchFullscreen();
    });

    /*
    , {
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
    */
  }
}
