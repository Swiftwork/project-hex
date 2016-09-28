import {
  Vector3,
  Scene,
  Effect,
} from 'babylonjs';

import AssetsLoader, {
  TextureAssetTask, MeshAssetTask, TextFileAssetTask, BinaryFileAssetTask, FontFileAssetTask,
} from '../Lib/AssetsLoader';

export default class AssetsManager {

  private assets: Map<string, any>;

  constructor() {
    this.assets = new Map<string, any>();
  }

  public add(id: string, asset: any): any {
    this.assets.set(id, asset);
    return asset;
  }

  public get(id: string): any {
    return this.assets.get(id);
  }

  public loadAllAssets(assetsLoader: AssetsLoader, callback: (tasks: any) => void): void {

    /* Register fonts to be loaded */
    for (let id in assetsManifest.fonts) {
      let fonts = assetsManifest.fonts[id];
      for (let fontType in fonts) {
        let task = assetsLoader.addFontAssetTask(`texture-${id}-${fontType}`, id);
        task.onSuccess = (task: FontFileAssetTask) => {
          this.add(`texture-${id}-${fontType}`, id);
        }
      }
    }

    /* Register interface textures to be loaded */
    for (let id in assetsManifest.interfaces) {
      let ui = assetsManifest.interfaces[id];
      let task = assetsLoader.addTextureTask(`interace-${id}`, ui);
      task.onSuccess = (task: TextureAssetTask) => {
        this.add(`interface-${id}`, task.texture);
      }
    }

    /* Register textures to be loaded */
    for (let id in assetsManifest.textures) {
      let textures = assetsManifest.textures[id];
      for (let textureType in textures) {
        let texture = textures[textureType];
        let task = assetsLoader.addTextureTask(`texture-${id}-${textureType}`, texture);
        task.onSuccess = (task: TextureAssetTask) => {
          this.add(`texture-${id}-${textureType}`, task.texture);
        }
      }
    }

    /* Register models to be loaded */
    for (let id in assetsManifest.models) {
      let models = assetsManifest.models[id].mesh;
      let task = assetsLoader.addMeshTask(`mesh-${id}`, '', '', models);
      task.onSuccess = (task: MeshAssetTask) => {
        for (var i = 0; i < task.loadedMeshes.length; ++i) {
          let mesh = task.loadedMeshes[i];
          mesh.setEnabled(false);
          this.add(`mesh-${mesh.name}`, mesh);
        }
      }
    }

    /* Register shaders to be loaded */
    for (let id in assetsManifest.shaders) {
      let vertex = assetsManifest.shaders[id].vertex;
      let fragment = assetsManifest.shaders[id].fragment;
      let taskVertex = assetsLoader.addTextFileTask(`shader-${id}-vertex`, vertex);
      let taskFragment = assetsLoader.addTextFileTask(`shader-${id}-fragment`, fragment);
      taskVertex.onSuccess = (task: TextFileAssetTask) => {
        this.add(`shader-${id}-vertex`, task.text);
        Effect.ShadersStore[`${id}VertexShader`] = task.text;
      }
      taskFragment.onSuccess = (task: TextFileAssetTask) => {
        this.add(`shader-${id}-fragment`, task.text);
        Effect.ShadersStore[`${id}PixelShader`] = task.text;
      }
    }

    assetsLoader.onFinish = callback;
    assetsLoader.load();
  }
}

//------------------------------------------------------------------------------------
// ASSETS TO LOAD
//------------------------------------------------------------------------------------

const assetsManifest = {
  fonts: {
    'icons': {
      woff: require('../Assets/fonts/icons/icons.woff'),
    },

    'outage':  {
      woff: require('../Assets/fonts/outage/outage.woff'),
      woff2: require('../Assets/fonts/outage/outage.woff2'),
    },

    'cubic':  {
      woff: require('../Assets/fonts/cubic/cubic.woff'),
      woff2: require('../Assets/fonts/cubic/cubic.woff2'),
    },
  },

  interfaces: {

    /* COMPASS */
    'compass': require('../Assets/interfaces/compass.svg'),
  },

  textures: {

    /* TABLE */
    'felt': {
      diffuse: require('../Assets/textures/felt.jpg'),
    },
    'wood': {
      diffuse: require('../Assets/textures/wood3.jpg'),
    },

    /* TILES */
    'dirt': {
      diffuse: require('../Assets/textures/dirt.svg'),
    },
    'grass': {
      diffuse: require('../Assets/textures/grass.svg'),
    },
    'ice': {
      diffuse: require('../Assets/textures/ice.svg'),
    },
    'sand': {
      diffuse: require('../Assets/textures/sand.svg'),
    },
    'snow': {
      diffuse: require('../Assets/textures/snow.svg'),
    },
    'stone': {
      diffuse: require('../Assets/textures/stone.svg'),
    },
    'water': {
      diffuse: require('../Assets/textures/water.svg'),
    },
  },

  models: {

    /* ENVIRONMENT */
    'environment': {
      mesh: require('../Assets/models/environment.babylon'),
    },

    /* STRUCTURES */
    'structures': {
      mesh: require('../Assets/models/structures.babylon'),
    },

    /* UNITS */
    'scout': {
      mesh: require('../Assets/models/scout.babylon'),
    },
  },

  shaders: {

    /* HIDDEN */
    'hidden': {
      vertex: require('../Assets/shaders/hidden.vertex.fx'),
      fragment: require('../Assets/shaders/hidden.fragment.fx'),
    },
  },
}