import {
  Vector2, Color4, Size,
  ScreenSpaceCanvas2D,
  Prim2DBase, Group2D, Text2D,
  PrimitivePointerInfo, EventState,
} from 'babylonjs';

import View from './View';

export default class Label2D extends Group2D {

  static ICON = {
    /* Interface */
    MENU: '\uE100',
    CLOSE: '\uE101',
    HOURGLASS: '\uE102',
    CLOCK: '\uE103',
    COMPASS: '\uE104',
    /* Game */
    LOG: '\uE200',
    GOLD: '\uE201',
    MAN: '\uE202',
    STEAK: '\uE203',
    STONE: '\uE204',
    BRAIN: '\uE205',
    VIAL: '\uE206',
    SWORDS: '\uE207',
    DAY: '\uE208',
    NIGHT: '\uE209',
  };

  public icon2d: Text2D;
  public text2d: Text2D;

  constructor(
    public options: {
      id?: string,
      parent?: Prim2DBase,
      icon?: string,
      text?: string,
      textSize?: number,
      color?: Color4,
      click?: (eventData: PrimitivePointerInfo, eventState: EventState) => void,

      // Avoid settings these
      children?: Prim2DBase[],
      layoutEngine?: string,
    }
  ) {
    super(options = Object.assign({
      icon: '',
      text: '',
      textSize: 32,
      color: new Color4(1, 1, 1, 1),
      click: null,
      children: [],
      layoutEngine: 'StackPanel',
    }, options));

    if (this.options.icon) {
      this.icon2d = new Text2D(this.options.icon, {
        id: `${this.id}-icon`,
        fontName: `${this.options.textSize}px icons`,
        defaultFontColor: this.options.color,
      });

      if (this.options.click)
        this.icon2d.pointerEventObservable.add(this.options.click, PrimitivePointerInfo.PointerUp);

      this.children.push(this.icon2d);
    }

    if (this.options.text) {
      this.text2d = new Text2D(this.options.text, {
        id: this.id,
        fontName: `${this.options.textSize}px outage`,
        defaultFontColor: this.options.color,
      });

      if (this.options.click)
        this.text2d.pointerEventObservable.add(this.options.click, PrimitivePointerInfo.PointerUp);

      this.children.push(this.text2d);
    }
  }

  public setIcon(icon: string) {
    this.icon2d.text = icon;
  }

  public setText(text: string) {
    this.text2d.text = text;
  }
}