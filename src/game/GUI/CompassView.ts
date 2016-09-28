import {
  Vector2, Size,
  ScreenSpaceCanvas2D,
  Sprite2D,
  Texture,
} from 'babylonjs';

import View from './View';

export default class CompassView extends View {

  public sprite: Sprite2D;

  constructor(
    public id: string,
    public canvas: ScreenSpaceCanvas2D,
    public texture: Texture,
  ) {
    super(id, canvas);

    this.sprite = new Sprite2D(texture, {
      id: this.id,
      parent: this.canvas,
      spriteSize: new Size(512, 512),
    });
  }
}