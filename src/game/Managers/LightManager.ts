import {
	Vector3,
	Color3,
	Scene,
	Light, PointLight, DirectionalLight, SpotLight, HemisphericLight,
} from 'babylonjs';

export default class LightManager {
	
	private lights: Map<string, Light>;

	public static LIGHT = {
		POINT: 1,
		DIRECTIONAL: 2,
		SPOT: 3,
		HEMISPHERIC: 4,
	}

	constructor(private scene: Scene) {
		this.lights = new Map<string, Light>();

		/* Sun Light */
		this.add('sunLight',
			LightManager.LIGHT.DIRECTIONAL,
			new Vector3(-2, -8, 4),
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
				intensity: 0.6,
		});
	}

	public add(id: string, type: number, direction: Vector3, position: Vector3, options?: any): any {
		let light;
		switch (type) {
			case LightManager.LIGHT.DIRECTIONAL:
				light = new DirectionalLight(id, direction, this.scene);
				break;

			case LightManager.LIGHT.SPOT:
				light = new SpotLight(id, direction, position, 0.8, 2, this.scene);
				break;

			case LightManager.LIGHT.HEMISPHERIC:
				light = new HemisphericLight(id, direction, this.scene);
				break;
		}
		
		if (position)
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