import {
  Vector2, Color4,
  ScreenSpaceCanvas2D,
  Texture, 
} from 'babylonjs';

import Label from './Label';
import Resource from '../Logic/Resource';
import View from './View';

export default class ResourceView extends View {

  private resources: Map<string, Label>;

  constructor(
    public id: string,
    public canvas: ScreenSpaceCanvas2D,
    public options: {
      position: Vector2,
      textSize: number,
    }
  ) {
    super(id, canvas);
    this.resources = new Map<string, Label>();
  }

  public layout() {
    const offset = this.options.position.clone();
    this.resources.forEach((label: Label) => {
      if (label.icon2d) {
        label.icon2d.position = offset.clone();
        offset.x += label.icon2d.size.width + 12;
        label.text2d.position = offset.clone();
        offset.x += label.text2d.size.width + 64;
      } else {
        label.text2d.position = this.options.position;
        offset.x += label.text2d.size.width + 64;
      }
    })
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    this.resources.set(resource.type, new Label(
      resource.type,
      this.canvas,
      `${resource.value} ${resource.type.capitalize()}`, {
        textSize: this.options.textSize,
        color: color,
        icon: icon,
      }
    ));

    this.layout();
  }
}