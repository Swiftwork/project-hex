import {
  Vector2, Color4, Size,
  ScreenSpaceCanvas2D,
  Text2D,
  PrimitivePointerInfo, EventState,
} from 'babylonjs';

import View from './View';

export default class Label extends View {

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

  private icon2d: Text2D;
  private text2d: Text2D;

  public size: Size;

  constructor(
    public id: string,
    public canvas: ScreenSpaceCanvas2D,
    public options: {
      position?: Vector2,
      icon?: string,
      text?: string,
      textSize?: number,
      color?: Color4,
      click?: (eventData: PrimitivePointerInfo, eventState: EventState) => void,
    }
  ) {
    super(id, canvas);

    this.options = Object.assign({
      position: new Vector2(0, 0),
      icon: '',
      text: '',
      textSize: 32,
      color: new Color4(1, 1, 1, 1),
      click: null,
    }, this.options);

    if (this.options.icon) {
      this.icon2d = new Text2D(this.options.icon, {
        id: `${this.id}-icon`,
        parent: this.canvas,
        fontName: `${this.options.textSize}px icons`,
        defaultFontColor: this.options.color,
      });

      if (this.options.click)
        this.icon2d.pointerEventObservable.add(this.options.click, PrimitivePointerInfo.PointerUp);
    }

    if (this.options.text) {
      this.text2d = new Text2D(this.options.text, {
        id: this.id,
        parent: this.canvas,
        fontName: `${this.options.textSize}px outage`,
        defaultFontColor: this.options.color,
      });

      if (this.options.click)
        this.text2d.pointerEventObservable.add(this.options.click, PrimitivePointerInfo.PointerUp);
    }
    
    this.layout();
  }

  public layout () {
    let offset = this.options.position.x;
    this.size = new Size(0, 0);

    if (this.icon2d) {
      this.icon2d.position = new Vector2(offset, this.options.position.y);
      this.size.width = this.icon2d.size.width;
      this.size.height = this.icon2d.size.height;
    }

    if (this.icon2d && this.text2d) {
      this.size.width += this.options.textSize / 2;
    }
    
    offset += this.size.width;

    if (this.text2d) {
      this.text2d.position = new Vector2(offset, this.options.position.y);
      this.size.width += this.text2d.width;
      this.size.height = Math.max(this.size.height, this.text2d.size.height);
    }
  }

  public setIcon(icon: string) {
    this.icon2d.text = icon;
  }

  public setText(text: string) {
    this.text2d.text = text;
  }
}