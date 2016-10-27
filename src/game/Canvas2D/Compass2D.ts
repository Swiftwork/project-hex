import {
  Vector2, Size,
  ScreenSpaceCanvas2D,
  RenderablePrim2D, Sprite2D,
  Texture,
} from 'babylonjs';

export default class Compass2D extends Sprite2D {

  constructor(
    public texture: Texture,
    public settings: {

    }
  ) {
    super(texture, settings = Object.assign({
      /* Defaults */
      size: new Size(256, 256),
    }, settings, {
        /* Overrides */
      }));
    this.settings = settings;
  }
}