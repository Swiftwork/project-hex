import {
  Vector2, Color4,
  ScreenSpaceCanvas2D,
  Texture, 
} from 'babylonjs';

import Label from './LabelView';
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
      label.options.position = offset.clone();
      label.layout();
      offset.x += label.size.width + 64;
    })
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    this.resources.set(resource.type, new Label(
      resource.type,
      this.canvas, {
        position: this.options.position,
        icon: icon,
        text: `${resource.value} ${resource.type.capitalize()}`,
        textSize: this.options.textSize,
        color: color,
      }
    ));

    this.layout();
  }
}