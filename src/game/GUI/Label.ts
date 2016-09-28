import {
  Color4, Size,
  ScreenSpaceCanvas2D,
  Text2D,
} from 'babylonjs';

import View from './View';

export default class Label extends View {

  static ICON = {
    LOG: '\uE900',
    GOLD: '\uE901',
    MAN: '\uE902',
    STEAK: '\uE903',
    STONE: '\uE904',
    MENU: '\uE905',
  };

  public icon2d: Text2D;
  public text2d: Text2D;

  constructor(
    public id: string,
    public canvas: ScreenSpaceCanvas2D,
    public text: string,
    public options: {
      textSize: number,
      color?: Color4,
      icon?: string,
    }
  ) {
    super(id, canvas);

    if (this.options.icon) {
      this.icon2d = new Text2D(this.options.icon, {
        id: `${this.id}-icon`,
        parent: this.canvas,
        fontName: `${this.options.textSize}px icons`,
        defaultFontColor: this.options.color,
      });
    }

    this.text2d = new Text2D(this.text, {
      id: this.id,
      parent: this.canvas,
      fontName: `${this.options.textSize}px outage`,
      defaultFontColor: this.options.color,
    });
  }
}