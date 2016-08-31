import {
	Vector2, Vector3, Vector4,
	Color3, Color4,
	Mesh, MeshBuilder, VertexBuffer,
	Scene, ArcRotateCamera,
	ShadowGenerator,
	ActionManager, InterpolateValueAction, ExecuteCodeAction, SwitchBooleanAction,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import CameraManager from './Managers/CameraManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';
import Hexagon from './Math/Hexagon';
import Tile from './Entities/Tile';

export default class GameRenderer {

	private scene: Scene;

	/* MANAGERS */
	private cameraManager: CameraManager;
	private lightManager: LightManager;
	private materialManager: MaterialManager;

	/* MESHES & LAYOUTS */
	private mainCamera: ArcRotateCamera;
	private meshes: Mesh[];

	constructor(
		private game: Game,
		private world: GameWorld
	) {
		/* Scene Defaults */
    this.scene = new Scene(this.game.engine);
    this.scene.collisionsEnabled = false;
    this.scene.clearColor = new Color3(0.9, 0.87, 0.85);
    this.scene.fogColor = this.scene.clearColor;
		this.scene.fogMode = Scene.FOGMODE_LINEAR;
		this.scene.fogStart = 10;
		this.scene.fogEnd = 15;

		/* Managers */
    this.cameraManager = new CameraManager(this.scene);
    this.lightManager = new LightManager(this.scene);
    this.materialManager = new MaterialManager(this.scene);

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

		/* Shadows */
		const sunLight = this.lightManager.get('sunLight');
    let shadowGenerator = new ShadowGenerator(1024, sunLight);
		shadowGenerator.useBlurVarianceShadowMap = true;
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
		this.world.tiles.forEach( (tile: Tile, coords: string) => {
			let mesh;

			if (tile.explored) {
				mesh = MeshBuilder.CreateCylinder(`tile-${coords}`, {
					height: 0.05,
					diameter: this.world.layout.size.x * 2 - 0.05,
					tessellation: 6,
					faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)],
				}, this.scene);
		    mesh.material = this.materialManager.get(tile.type);
				mesh.edgesWidth = 2;
				mesh.edgesColor = new Color4(0.5, 0, 0.5, 1);

				/* Tile Actions */
				mesh.actionManager = new ActionManager(this.scene);
			  mesh.actionManager.registerAction(new ExecuteCodeAction(
			  	ActionManager.OnPickTrigger,
			  	() => {
			  		mesh.enableEdgesRendering(1)
			  	})
			  );
				this.meshes.push(mesh);
			} else {
				mesh = unexploredMesh.createInstance(`tile-${coords}`);
			}
			mesh.position = this.world.layout.hexagonToPixel(tile.hexagon, 0.025);
		  mesh.rotation = new Vector3(0, Math.PI / 3, 0);
		}, this);
	}
}