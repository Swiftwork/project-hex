import {
	Vector3,
	Color3,
	Scene,
	Light, PointLight, DirectionalLight, SpotLight, HemisphericLight,
} from 'babylonjs';

export default class PlayerManager {
	
	private players: Map<string, Light>;

	constructor(private scene: Scene) {
		this.players = new Map<string, Light>();

		/* Sun Light */
		this.add('sunLight',
			LightManager.LIGHT.DIRECTIONAL,
			new Vector3(2, -4, 2),
			new Vector3(-20, 40, -20),
			{
				intensity: 1,
			}
		);

		/* Ambient Light */
		this.add('ambientLight',
			LightManager.LIGHT.HEMISPHERIC,
			new Vector3(0, 1, 0),
			new Vector3(0, 0, 0),
			{
				intensity: 0.5,
				diffuse: new Color3(1, 1, 1),
				specular: new Color3(1, 1, 1),
				groundColor: new Color3(0, 0, 0),
		});
	}

	public add(id: string, type: number, direction: Vector3, position: Vector3, options?: any): any {
		let light;
		switch (type) {
			case LightManager.LIGHT.DIRECTIONAL:
				light = new DirectionalLight(id, direction, this.scene);
				break;

			case LightManager.LIGHT.HEMISPHERIC:
				light = new HemisphericLight(id, direction, this.scene);
				break;

			case LightManager.LIGHT.POINT:
			default:
				break;
		}
		light.position = position;

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