import {
	Vector2, Vector3, Vector4,
	Color3, Color4,
	Mesh, MeshBuilder,
	Scene, ArcRotateCamera,
	ShadowGenerator,
	ActionManager, InterpolateValueAction, ExecuteCodeAction, SwitchBooleanAction,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import CustomMesh from './Math/CustomMesh';
import Tile from './Entities/Tile';
import CameraManager from './Managers/CameraManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';

export default class GameRenderer {

	/* MANAGERS */
	private cameraManager: CameraManager;
	private lightManager: LightManager;
	private materialManager: MaterialManager;

	/* GENERAL */
	private mainCamera: ArcRotateCamera;
	private meshes: Mesh[];

	constructor(
		private game: Game,
		private world: GameWorld,
		private scene: Scene
	) {
		/* Scene Defaults */
    this.scene.clearColor = new Color3(0.9, 0.87, 0.85);
    this.scene.fogColor = this.scene.clearColor;
		this.scene.fogMode = Scene.FOGMODE_LINEAR;
		this.scene.fogStart = 10;
		this.scene.fogEnd = 15;

		/* Managers */
    this.cameraManager = new CameraManager(this.scene);
    this.lightManager = new LightManager(this.scene);
    this.materialManager = new MaterialManager(this.scene, this.game.assetsManager);

    /* Cameras */
		this.mainCamera = this.cameraManager.get('main');
		this.mainCamera.setTarget(Vector3.Zero());
		this.mainCamera.attachControl(this.game.canvas, false, false);

		/* Tile Storage */
		this.meshes = [];

		/* Scene Actions */
		this.scene.actionManager = new ActionManager(this.scene);
		this.scene.actionManager.registerAction(new ExecuteCodeAction(
			ActionManager.OnKeyDownTrigger,
			(event) => {
				/* Debug */
				if (event.sourceEvent.keyCode === 192) {
					if (!this.scene.debugLayer.isVisible())
						this.scene.debugLayer.show();
					else
						this.scene.debugLayer.hide();
   			}
			}
		));
	}

	onCreate() {
		this.createGround();
		this.createTiles();
		this.scene.createOrUpdateSelectionOctree();

		/* Shadows */
		const sunLight = this.lightManager.get('sunLight');
    let shadowGenerator = new ShadowGenerator(4096, sunLight);
		shadowGenerator.bias = 0.0001;
		shadowGenerator.useBlurVarianceShadowMap = true;
		shadowGenerator.getShadowMap().refreshRate = 0;
		shadowGenerator.getShadowMap().renderList = 
			shadowGenerator.getShadowMap().renderList.concat(this.meshes);

		this.game.engine.runRenderLoop(this.onUpdate.bind(this));
	}

	onResume() {
		this.game.engine.runRenderLoop(this.onUpdate.bind(this));
	}

	onUpdate() {
		this.scene.render();
		this.mainCamera.panningSensibility = 100 * (this.mainCamera.upperRadiusLimit / this.mainCamera.radius);
	}

	onPause () {
		this.game.engine.stopRenderLoop();
	}

	onDestroy () {

	}

	/* MESH CREATION */

	createGround() {
		let ground = Mesh.CreateGround("ground", 100, 100, 2, this.scene);
		ground.material = this.materialManager.get('paper');
		ground.receiveShadows = true;
	}

	createTiles() {
		/* Unexplored Tiles */
		const unexploredMesh = MeshBuilder.CreateCylinder(`tile-unexplored`, {
			height: 0.05,
			diameter: this.world.layout.size.x * 2 - 0.05,
			tessellation: 6,
		}, this.scene);
		unexploredMesh.visibility = 0.4;

		/* Explored Tiles */
		this.world.tiles.forEach( (tile: Tile) => {
			let mesh;

			if (tile.explored) {
				mesh = MeshBuilder.CreateCylinder(`tile-${tile.hexagon.toString()}`, {
					height: 0.05,
					diameter: this.world.layout.size.x * 2 - 0.05,
					tessellation: 6,
					faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)],
				}, this.scene);
		    mesh.material = this.materialManager.get(tile.type);
		    mesh.receiveShadows = true;
				mesh.edgesWidth = 2;
				mesh.edgesColor = new Color4(0.5, 0, 0.5, 1);

				/* Entities on tile */
				this.createEntities(tile, mesh);

				/* Tile Actions */
				mesh.actionManager = new ActionManager(this.scene);
			  mesh.actionManager.registerAction(new ExecuteCodeAction(
			  	ActionManager.OnPickTrigger,
			  	() => {
			  		mesh.enableEdgesRendering(1)
			  	})
			  );
				//this.meshes.push(mesh);
			} else {
				mesh = unexploredMesh.createInstance(`tile-${tile.hexagon.toString()}`);
			}
			mesh.position = this.world.layout.hexagonToPixel(tile.hexagon, 0.025);
		  mesh.rotation = new Vector3(0, Math.PI / 3, 0);
		}, this);
	}

	createEntities(tile: Tile, parent: Mesh ) {
		for (var i = 0; i < tile.environment.length; ++i) {
			const environment = tile.environment[i];
			let mesh;

			if (typeof environment.model !== 'undefined') {
				const original = this.game.assetsManager.get(`mesh-${environment.model}`);
				const bounds = original.getBoundingInfo().boundingBox;
				mesh = original.createInstance(`tile-${tile.hexagon.toString()}-${environment.id}-${i}`);
				mesh.position = environment.position;
				mesh.position.y = 0.05 + (bounds.maximumWorld.y - bounds.minimumWorld.y) / 2;
			} else {
				mesh = CustomMesh.CreateMountain(`tile-${tile.hexagon.toString()}-${environment.id}-${i}`, {
					base: environment.pathArray[0],
					peak: environment.pathArray[1],
					//sideOrientation: Mesh.DOUBLESIDE,
				}, this.scene);
				mesh.position = environment.position;
				mesh.position.y = 0.05;
			}

			this.meshes.push(mesh);
		}
	}
}