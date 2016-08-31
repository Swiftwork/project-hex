import { Scene, Color3, StandardMaterial, Texture, VideoTexture, CubeTexture } from 'babylonjs';

export default class MaterialManager {

	private materials: Map<string, StandardMaterial>;

	constructor(private scene: Scene) {
		this.materials = new Map<string, StandardMaterial>();

		/* GROUND */
		this.add('paper', 'paper', [30, 30]);

		/* TERRAIN TYPES */
		this.add('barren', 'dirt');
		this.add('plain', 'grass');
		this.add('desert', 'sand');
		this.add('mountain', 'stone');
		this.add('ocean', 'water');
		this.add('forest', 'grass');
	}

	public add(id: string, filename: string, uv?: number[]): StandardMaterial {
		const material = new StandardMaterial(id, this.scene);

		try {
			material.diffuseTexture = new Texture(require(`../Assets/${filename}.jpg`), this.scene);
			if (typeof uv !== 'undefined') {
				(<Texture> material.diffuseTexture).uScale = uv[0];
				(<Texture> material.diffuseTexture).vScale = uv[1];
			}

			material.bumpTexture = new Texture(require(`../Assets/${filename}-bump.jpg`), this.scene);
			if (typeof uv !== 'undefined') {
				(<Texture> material.bumpTexture).uScale = uv[0];
				(<Texture> material.bumpTexture).vScale = uv[1];
			}
		} catch(e) {}
		material.specularTexture = material.diffuseTexture;

		material.specularPower = 100;
		this.materials.set(id, material);
		return material;
	}

	/*
	public addSky(id: string, filename: string): StandardMaterial {
		const material = new StandardMaterial(id, this.scene);
		material.backFaceCulling = false;
		material.disableLighting = true;
		material.diffuseColor = new Color3(0, 0, 0);
		material.specularColor = new Color3(0, 0, 0);
    material.reflectionTexture = new Texture(require(`../Assets/${filename}`), this.scene);
    material.reflectionTexture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;
		material.reflectionTexture = new CubeTexture('', this.scene, null, false, [
			require(`../Assets/${filename}/${filename}Left.png`),
			require(`../Assets/${filename}/${filename}Up.png`),
			require(`../Assets/${filename}/${filename}Front.png`),
			require(`../Assets/${filename}/${filename}Right.png`),
			require(`../Assets/${filename}/${filename}Down.png`),
			require(`../Assets/${filename}/${filename}Back.png`),
		]);
		material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
		this.materials.set(id, material);
		return material;
	}
	*/

	public get(id: string): StandardMaterial {
		return this.materials.get(id);
	}
}