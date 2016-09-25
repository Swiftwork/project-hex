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

		/* TABLE */
		const base = this.add('felt', 'felt', [-10, -10]);
		base.diffuseColor = new Color3(0.04, 0.28, 0.42);

    const edge = this.add('wood', 'wood', [-50, -50]);
		edge.specularColor = new Color3(0.5, 0.5, 0.5);
		edge.specularPower = 100;

    /* UNEXPLORED */
		const unexplored = this.add('unexplored', '');
    unexplored.diffuseColor = new Color3(1, 1, 1);
    
		/* TERRAIN TYPES */
		const actic = this.add('arctic', 'snow', [-1, -1]);

		const barren = this.add('barren', 'dirt', [-1, -1]);

		const desert = this.add('desert', 'sand', [-1, -1]);

		const forest = this.add('forest', 'grass', [-1, -1]);
		forest.diffuseColor = new Color3(0.5, 0.5, 0.5);

		const glacier = this.add('glacier', 'ice', [-1, -1]);
		glacier.specularColor = new Color3(0.5, 0.5, 0.5);
		glacier.specularPower = 100;
		glacier.alpha = 0.9;

		const mountain = this.add('mountain', 'stone', [-1, -1]);

		const ocean = this.add('ocean', 'water', [-1, -1]);
		ocean.specularColor = new Color3(0.3, 0.3, 0.3);
		ocean.specularPower = 100;
		ocean.alpha = 0.9;

		const plain = this.add('plain', 'grass', [-1, -1]);
	}

	public add(id: string, texture: string, uv?: number[], uvOffset?: number[]): StandardMaterial {
		const material = new StandardMaterial(id, this.scene);

		material.diffuseTexture = this.assetsManager.get(`texture-${texture}-diffuse`);
		if (material.diffuseTexture) {
			if (typeof uv !== 'undefined') {
				(<Texture> material.diffuseTexture).uScale = uv[0];
				(<Texture> material.diffuseTexture).vScale = uv[1];
			}
			if (typeof uvOffset !== 'undefined') {
				(<Texture> material.diffuseTexture).uOffset = uvOffset[0];
				(<Texture> material.diffuseTexture).vOffset = uvOffset[1];
			}
		}

		material.bumpTexture = this.assetsManager.get(`texture-${texture}-bump`);
		if (material.bumpTexture) {
			if (typeof uv !== 'undefined') {
				(<Texture> material.bumpTexture).uScale = uv[0];
				(<Texture> material.bumpTexture).vScale = uv[1];
			}
			if (typeof uvOffset !== 'undefined') {
				(<Texture> material.bumpTexture).uOffset = uvOffset[0];
				(<Texture> material.bumpTexture).vOffset = uvOffset[1];
			}
		}

		material.specularColor = new Color3(0, 0, 0);
		material.specularPower = 0;
		this.materials.set(id, material);
		return material;
	}

	public get(id: string): StandardMaterial {
		return this.materials.get(id);
	}
}