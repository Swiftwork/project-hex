import { TextBlock } from 'babylonjs-gui';

export default class Label extends TextBlock {

  static ICON = {
    /* Interface */
    MENU: '\uE100',
    EXPAND: '\uE101',
    CLOSE: '\uE102',
    HOURGLASS: '\uE103',
    CLOCK: '\uE104',
    COMPASS: '\uE105',
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

  constructor(
    public name: string,
    public text: string,
    public icon?: string,
  ) {
    super(name, icon ? `${icon} ${text}` : text);
    this.fontFamily = '16pt arial' + (icon ? ', icons' : '');
  }
}
