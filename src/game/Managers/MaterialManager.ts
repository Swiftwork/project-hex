import {
	Scene,
	Color3,
	StandardMaterial, Texture,
} from 'babylonjs';
import AssetsManager from './AssetsManager';

export default class MaterialManager {

	private materials: Map<string, StandardMaterial>;

	constructor(private scene: Scene, private assetsManager: AssetsManager) {
		this.materials = new Map<string, StandardMaterial>();
		/* GROUND */
		this.add('paper', 'paper', [50, 50]);

		/* TERRAIN TYPES */
		this.add('barren', 'dirt');
		this.add('plain', 'grass');
		this.add('desert', 'sand');
		this.add('mountain', 'stone');
		this.add('ocean', 'water');
		this.add('forest', 'grass');
	}

	public add(id: string, texture: string, uv?: number[]): StandardMaterial {
		const material = new StandardMaterial(id, this.scene);

		material.diffuseTexture = this.assetsManager.get(`texture-${texture}-diffuse`);
		if (material.diffuseTexture && typeof uv !== 'undefined') {
			(<Texture> material.diffuseTexture).uScale = uv[0];
			(<Texture> material.diffuseTexture).vScale = uv[1];
		}

		material.bumpTexture = this.assetsManager.get(`texture-${texture}-bump`);
		if (material.bumpTexture && typeof uv !== 'undefined') {
			(<Texture> material.bumpTexture).uScale = uv[0];
			(<Texture> material.bumpTexture).vScale = uv[1];
		}

		material.specularTexture = material.diffuseTexture;

		material.specularPower = 100;
		this.materials.set(id, material);
		return material;
	}

	public get(id: string): StandardMaterial {
		return this.materials.get(id);
	}
}