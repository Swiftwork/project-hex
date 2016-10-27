import {
  Scene, Effect,
  Color3, Vector3,
  Texture, Material, StandardMaterial, ShaderMaterial,
} from 'babylonjs';

import Game from '../Game';
import AssetManager from './AssetManager';

export default class MaterialManager {

  private materials: Map<string, Material>;

  constructor(private game: Game) {
    this.materials = new Map<string, Material>();

    /* SKY */
    const sky = new StandardMaterial('sky', this.game.scene);
    sky.backFaceCulling = false;
    sky.disableLighting = true;
    sky.diffuseColor = new BABYLON.Color3(0, 0, 0);
    sky.specularColor = new BABYLON.Color3(0, 0, 0);
    sky.reflectionTexture = this.game.assetManager.get('texture-sky');
    sky.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    this.materials.set('sky', sky);

    /* TABLE */
    const base = this.add('felt', 'felt', [-10, -10]);
    base.diffuseColor = new Color3(0.05, 0.32, 0.50);

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
    const material = new StandardMaterial(id, this.game.scene);

    material.diffuseTexture = this.game.assetManager.get(`texture-${texture}-diffuse`);
    if (material.diffuseTexture) {
      if (typeof uv !== 'undefined') {
        (<Texture>material.diffuseTexture).uScale = uv[0];
        (<Texture>material.diffuseTexture).vScale = uv[1];
      }
      if (typeof uvOffset !== 'undefined') {
        (<Texture>material.diffuseTexture).uOffset = uvOffset[0];
        (<Texture>material.diffuseTexture).vOffset = uvOffset[1];
      }
    }

    material.bumpTexture = this.game.assetManager.get(`texture-${texture}-bump`);
    if (material.bumpTexture) {
      if (typeof uv !== 'undefined') {
        (<Texture>material.bumpTexture).uScale = uv[0];
        (<Texture>material.bumpTexture).vScale = uv[1];
      }
      if (typeof uvOffset !== 'undefined') {
        (<Texture>material.bumpTexture).uOffset = uvOffset[0];
        (<Texture>material.bumpTexture).vOffset = uvOffset[1];
      }
    }

    material.specularColor = new Color3(0, 0, 0);
    material.specularPower = 0;
    this.materials.set(id, material);

    this.addHidden(id, texture, uv, uvOffset);
    return material;
  }

  public addHidden(id: string, texture: string, uv?: number[], uvOffset?: number[]): ShaderMaterial {
    const material = new ShaderMaterial(`${id}-hidden`, this.game.scene, {
      vertex: "hidden",
      fragment: "hidden",
    },
      {
        attributes: ["position", "uv"],
        uniforms: ["worldViewProjection"]
      });

    const diffuseTexture = this.game.assetManager.get(`texture-${texture}-diffuse`);
    if (diffuseTexture) {
      material.setTexture("textureSampler", diffuseTexture);
    }

    this.materials.set(`${id}-hidden`, material);
    return material;
  }

  public get(id: string): Material {
    return this.materials.get(id);
  }
}