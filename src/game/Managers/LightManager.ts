import {
  Vector3,
  Color3,
  Scene,
  Light, PointLight, DirectionalLight, SpotLight, HemisphericLight,
} from 'babylonjs';

import Game from '../Game';

export default class LightManager {

  private lights: Map<string, Light>;

  public static LIGHT = {
    POINT: 1,
    DIRECTIONAL: 2,
    SPOT: 3,
    HEMISPHERIC: 4,
  }

  constructor(private game: Game) {
    this.lights = new Map<string, Light>();

    /* Sun Light */
    this.add('sunLight',
      LightManager.LIGHT.DIRECTIONAL,
      new Vector3(-2, -4, 6),
      null,
      {
        intensity: 0.7,
      }
    );

    /* Ambient Light */
    this.add('ambientLight',
      LightManager.LIGHT.HEMISPHERIC,
      new Vector3(0, 1, 0),
      null,
      {
        intensity: 0.7,
      });
  }

  public add(id: string, type: number, direction: Vector3, position: Vector3, options?: any): any {
    let light;
    switch (type) {
      case LightManager.LIGHT.DIRECTIONAL:
        light = new DirectionalLight(id, direction, this.game.scene);
        if (position)
          light.position = position;
        break;

      case LightManager.LIGHT.SPOT:
        light = new SpotLight(id, direction, position, 0.8, 2, this.game.scene);
        if (position)
          light.position = position;
        break;

      case LightManager.LIGHT.HEMISPHERIC:
        light = new HemisphericLight(id, direction, this.game.scene);
        break;
    }

    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        light[option] = options[option];
      }
    }
    this.lights.set(id, light);
    return light;
  }

  public get(id: string): any {
    return this.lights.get(id);
  }
}
