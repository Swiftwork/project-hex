import { Color4 } from 'babylonjs';
import { Control, StackPanel } from 'babylonjs-gui';

import Resource from '../Logic/Resource';
import Label2D from './Label';

export default class Resources extends StackPanel {

  private resources: Map<string, Label2D>;

  constructor(
    public name: string,
  ) {
    super(name);
    this.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.resources = new Map<string, Label2D>();
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    const resourceLabel = new Label2D(resource.type, `${resource.value} ${resource.type.capitalize()}`, icon);
    resourceLabel.color = color.toHexString();
    this.resources.set(resource.type, resourceLabel);
  }
}
