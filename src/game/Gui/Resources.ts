import { Color4 } from 'babylonjs';
import { Control, StackPanel } from 'babylonjs-gui';

import Resource from '../Logic/Resource';
import Label from './Label';

export default class Resources extends StackPanel {

  private resources: Map<string, Label>;

  constructor(
    name: string,
  ) {
    super(name);
    this.resources = new Map<string, Label>();
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    const resourceLabel = new Label(resource.type, `${resource.value} ${resource.type.capitalize()}`, icon);
    resourceLabel.color = color.toHexString();
    resourceLabel.width = '120px';
    resourceLabel.height = '48px';
    this.resources.set(resource.type, resourceLabel);
    this.addControl(resourceLabel);
  }
}
