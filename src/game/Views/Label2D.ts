import {
  Vector2, Color4, Size,
  ScreenSpaceCanvas2D,
  Prim2DBase, Group2D, Text2D,
  PrimitivePointerInfo, EventState,
} from 'babylonjs';

import View from './View';

export default class Label2D extends Text2D {

  static ICON = {
    /* Interface */
    MENU: '\uE100',
    CLOSE: '\uE101',
    HOURGLASS: '\uE102',
    CLOCK: '\uE103',
    COMPASS: '\uE104',
    /* Game */
    LOG: '\uE200',
    STONE: '\uE201',
    GOLD: '\uE202',
    STEAK: '\uE203',
    MAN: '\uE204',
    BRAIN: '\uE205',
    VIAL: '\uE206',
    SWORDS: '\uE207',
    DAY: '\uE208',
    NIGHT: '\uE209',
  };

  private _icon;

  constructor(
    public text: string,
    public icon: string,
    public settings?: {
      parent?:                 Prim2DBase,
      children?:               Array<Prim2DBase>,
      id?:                     string,
      position?:               Vector2,
      x?:                      number,
      y?:                      number,
      rotation?:               number,
      scale?:                  number,
      scaleX?:                 number,
      scaleY?:                 number,
      dontInheritParentScale?: boolean,
      opacity?:                number,
      zOrder?:                 number,
      origin?:                 Vector2,
      iconSize?:               number,
      fontName?:               string,
      fontSuperSample?:        boolean,
      defaultFontColor?:       Color4,
      size?:                   Size,
      tabulationSize?:         number,
      isVisible?:              boolean,
      isPickable?:             boolean,
      isContainer?:            boolean,
      childrenFlatZOrder?:     boolean,
      marginTop?:              number | string,
      marginLeft?:             number | string,
      marginRight?:            number | string,
      marginBottom?:           number | string,
      margin?:                 number | string,
      marginHAlignment?:       number,
      marginVAlignment?:       number,
      marginAlignment?:        string,
      paddingTop?:             number | string,
      paddingLeft?:            number | string,
      paddingRight?:           number | string,
      paddingBottom?:          number | string,
      padding?:                string,
      onClick?:                () => void,
    }
  ) {
    super(text, settings = Object.assign({
      /* Defaults */
      iconSize: 1,
    }, settings, {
      /* Overrides */
      fontName: (settings.fontName ? settings.fontName : '16pt arial') + (icon ? ', icons' : ''),
    }));
    this.settings = settings;

    if (this.icon) {
      this.text = `${this.icon} ${this.text}`;
    }

    if (this.settings.onClick) {
      this.pointerEventObservable.add(this.settings.onClick, PrimitivePointerInfo.PointerUp);
    }
  }

  public setIcon(icon: string) {
    this.icon = icon;
  }
}