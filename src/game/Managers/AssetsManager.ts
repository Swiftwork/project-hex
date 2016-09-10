import {
	Scene,
	AssetsManager as AssetsLoader, TextureAssetTask, MeshAssetTask,
	Vector3,
} from 'babylonjs';

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

		/* Register textures to be loaded */
 		for (let id in assetsManifest.textures) {
 			let textures = assetsManifest.textures[id];

 			for (let textureType in textures) {
 				let texture = textures[textureType];
 				let task = assetsLoader.addTextureTask(`${id}-${textureType}`, texture);
				task.onSuccess = (task: TextureAssetTask) => {
					this.add(`texture-${id}-${textureType}`, task.texture);
				}
 			}
 		}

 		/* Register models to be loaded */
 		for (let id in assetsManifest.models) {
 			let models = assetsManifest.models[id].mesh;
 			let task = assetsLoader.addMeshTask(id, '', '', models);
 			task.onSuccess = (task: MeshAssetTask) => {
 				for (var i = 0; i < task.loadedMeshes.length; ++i) {
 					let mesh = task.loadedMeshes[i];
 					mesh.setEnabled(false);
 					this.add(`mesh-${mesh.id}`, mesh)
 				}
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
	textures: {

		/* GROUND */
		paper: {
			diffuse: require('../Assets/textures/paper.jpg'),
			bump: require('../Assets/textures/paper-bump.jpg'),
		},
		wood: {
			diffuse: require('../Assets/textures/wood.jpg'),
			bump: require('../Assets/textures/wood-bump.jpg'),
		},

		/* TILES */
		dirt: {
			diffuse: require('../Assets/textures/dirt.svg'),
			//bump: require('../Assets/textures/dirt-bump.jpg'),
		},
		grass: {
			diffuse: require('../Assets/textures/grass.svg'),
			//bump: require('../Assets/textures/grass-bump.jpg'),
		},
		ice: {
			diffuse: require('../Assets/textures/ice.svg'),
		},
		sand: {
			diffuse: require('../Assets/textures/sand.svg'),
			//bump: require('../Assets/textures/sand-bump.jpg'),
		},
		snow: {
			diffuse: require('../Assets/textures/snow.svg'),
		},
		stone: {
			diffuse: require('../Assets/textures/stone.svg'),
			//bump: require('../Assets/textures/stone-bump.jpg'),
		},
		water: {
			diffuse: require('../Assets/textures/water.svg'),
			//bump: require('../Assets/textures/water-bump.jpg'),
		},
	},

	models: {

		/* ENVIRONMENT */
		trees: {
			mesh: require('../Assets/models/trees.babylon'),
		}
	},
}