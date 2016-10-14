import {
  Vector2, Color4,
  Texture,
  ScreenSpaceCanvas2D, Group2D,
} from 'babylonjs';

import Label2D from './Label2D';
import Resource from '../Logic/Resource';

export default class Resources2D extends Group2D {

  private resources: Map<string, Label2D>;

  constructor(
    public settings: {
      id?: string,
      parent?: any,
      marginAlignment?: string,
      marginTop?: number,
      fontName?: string,
    }
  ) {
    super(settings = Object.assign({
      /* Defaults */
      layoutEngine: 'Stackpanel'
    }, settings, {
        /* Overrides */
      })
    );
    this.settings = settings;

    this.resources = new Map<string, Label2D>();
  }

  public addResource(resource: Resource, icon: string, color = new Color4(1, 1, 1, 1)) {
    this.resources.set(resource.type, new Label2D(`${resource.value} ${resource.type.capitalize()}`, icon, {
      id: resource.type,
      parent: this,
      fontName: this.settings.fontName,
      defaultFontColor: color,
      marginLeft: 50,
    }));
  }
}