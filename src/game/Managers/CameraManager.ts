import {
  Vector3,
  Scene,
  Camera,
  ArcRotateCamera,
} from 'babylonjs';

import Game from '../Game';
import Graphics from '../Utils/Graphics';

export default class CameraManager {

  private cameras: Map<string, Camera>;

  public static CAMERA = {
    UNIVERSAL: 1,
    ARC_ROTATE: 2,
    FREE: 3,
    FOLLOW: 4,
    TOUCH: 5,
    GAMEPAD: 6,
    DEVICE_ORIENTATION: 7,
    VIRTUAL_JOYSTICK: 8,
    ANAGLYPH: 9,
    VR_DEVICE_ORIENTATION: 10,
    WEB_VR_FREE: 11,
  }

  constructor(private game: Game) {

    this.cameras = new Map<string, Camera>();

    /* MAIN CAMERA */
    this.add('main', CameraManager.CAMERA.ARC_ROTATE, {
      alpha: Graphics.toRadians(360),
      beta: Graphics.toRadians(40),
      radius: 5,
      position: Vector3.Zero(),
      settings: {
        lowerRadiusLimit: 2,
        upperRadiusLimit: 50,
        //lowerAlphaLimit: CameraManager.toRadians(360),
        //upperAlphaLimit: CameraManager.toRadians(360),
        lowerBetaLimit: Graphics.toRadians(30),
        upperBetaLimit: Graphics.toRadians(75),
        panningAxis: new Vector3(1, 0, 1),
        inertia: 0.7,
      }
    });
  }

  public add(id: string, type: number, options: any): Camera {
    let camera;
    switch (type) {
      case CameraManager.CAMERA.ARC_ROTATE:
        camera = new ArcRotateCamera(id, options.alpha, options.beta, options.radius, options.position, this.game.scene);
        break;

      case CameraManager.CAMERA.UNIVERSAL:
      default:
        break;
    }
    for (var setting in options.settings) {
      if (options.settings.hasOwnProperty(setting)) {
        camera[setting] = options.settings[setting];
      }
    }
    this.cameras.set(id, camera);
    return camera;
  }

  public get(id: string): Camera {
    return this.cameras.get(id);
  }
}