import {
	Vector3,
	Scene,
	Camera,
	ArcRotateCamera,
} from 'babylonjs';

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

	constructor(private scene: Scene) {

		this.cameras = new Map<string, Camera>();

		/* MAIN CAMERA */
		this.add('main', CameraManager.CAMERA.ARC_ROTATE, {
			alpha: CameraManager.toRadians(360),
			beta: CameraManager.toRadians(40),
			radius: 5,
			position: Vector3.Zero(),
			settings: {
				lowerRadiusLimit: 3,
				upperRadiusLimit: 100,
				lowerAlphaLimit: CameraManager.toRadians(360),
				upperAlphaLimit: CameraManager.toRadians(360),
				lowerBetaLimit: CameraManager.toRadians(30),
				upperBetaLimit: CameraManager.toRadians(65),
				panningAxis: new Vector3(1, 0, 1),
				inertia: 0.5,
			}
		});
	}

	public add(id: string, type: number, options: any): any {
		let camera;
		switch (type) {
			case CameraManager.CAMERA.ARC_ROTATE:
				camera = new ArcRotateCamera(id, options.alpha, options.beta, options.radius, options.position, this.scene);
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

	public get(id: string): any {
		return this.cameras.get(id);
	}

	public static toRadians(degrees: number) {
	  return degrees * Math.PI / 180;
	}
 
	public static toDegrees(radians: number) {
	  return radians * 180 / Math.PI;
	}
}