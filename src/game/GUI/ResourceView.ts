import {
  Color4,
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
  ) {
    super(id, canvas);
    this.resources = new Map<string, Label>();
  }

  public layout() {
    this.resources.forEach((label: Label) => {
      console.log(label.text2d.size);
    })
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    this.resources.set(resource.type, new Label(
      resource.type,
      this.canvas,
      `${resource.value} ${resource.type.capitalize()}`, {
        textSize: 32,
        color: color,
        icon: icon,
      }
    ));

    this.layout();
  }
}