import {
	Vector2, Vector3, Vector4,
	Color3, Color4,
	Mesh, MeshBuilder,
	Scene, ArcRotateCamera, Camera,
	DirectionalLight, HemisphericLight, ShadowGenerator,
	ActionManager, InterpolateValueAction, ExecuteCodeAction, SwitchBooleanAction,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import CameraManager from './Managers/CameraManager';
import MaterialManager from './Managers/MaterialManager';
import Hexagon from './Math/Hexagon';
import Tile from './Entities/Tile';

import { HexagonLayout } from './Math/HexagonLayout';

export default class GameRenderer {

	private scene: Scene;

	/* MANAGERS */
	private cameraManager: CameraManager;
	private materialManager: MaterialManager;

	/* MESHES & LAYOUTS */
	private mainCamera: ArcRotateCamera;
	private layout: HexagonLayout;
	private meshes: Mesh[];

	constructor(
		private game: Game,
		private world: GameWorld
	) {
    this.scene = new Scene(this.game.engine);
    this.scene.clearColor = new Color3(0.9, 0.87, 0.85);
    this.scene.fogColor = new Color3(0.9, 0.87, 0.85);
		this.scene.fogMode = Scene.FOGMODE_LINEAR;
		this.scene.fogStart = 10;
		this.scene.fogEnd = 15;



		/* Managers */
    this.cameraManager = new CameraManager(this.scene);
    this.materialManager = new MaterialManager(this.scene);

		this.mainCamera = this.cameraManager.get('main');
		this.mainCamera.setTarget(Vector3.Zero());
		this.mainCamera.attachControl(this.game.canvas, false, false);

    //let sunLight = new DirectionalLight("sunLight", new Vector3(-3, -3, -1), this.scene);
		let sunLight = new DirectionalLight('sunLight', new Vector3(2, -4, 2), this.scene);
		sunLight.position = new Vector3(-20, 40, -20);
		sunLight.intensity = 1;

    let ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
		ambientLight.diffuse = new Color3(1, 1, 1);
		ambientLight.specular = new Color3(1, 1, 1);
		ambientLight.groundColor = new Color3(0, 0, 0);
		ambientLight.intensity = 0.5;

		/*
		let skybox = Mesh.CreateBox("skyBox", 100.0, this.scene);
		skybox.material = this.materialManager.get('tropicalSky');
		skybox.infiniteDistance = true;
		*/

		let ground = Mesh.CreateGround("ground", 100, 100, 2, this.scene);
		ground.material = this.materialManager.get('paper');
		ground.receiveShadows = true;

    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL, new Vector2(0.5, 0.5), new Vector3(0, 0, 0));
		this.meshes = [];
		let firstInstance = {}
		this.world.tiles.forEach( (tile: Tile, coords: string) => {
			let mesh;

			if (tile.type in firstInstance) {
				mesh = firstInstance[tile.type].createInstance(`tile-${coords}`);

			} else {
				mesh = MeshBuilder.CreateCylinder(`tile-${coords}`, {
					height: 0.05,
					diameter: 0.95,
					tessellation: 6,
					faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)],
				}, this.scene);
		    mesh.rotation = new Vector3(0, Math.PI / 3, 0);
		    mesh.material = this.materialManager.get(tile.type);
				firstInstance[tile.type] = mesh;
			}

		  mesh.position = this.layout.hexagonToPixel(tile.hexagon, 0.025);
		  mesh.elevated = false;
		  mesh.actionManager = new ActionManager(this.scene);
		  mesh.actionManager.registerAction(new InterpolateValueAction(
		  	ActionManager.OnPickTrigger,
		  	mesh,
		  	"position.y",
		  	mesh.elevated ? 0.025 : 0.125, 250)
		  ).then(new ExecuteCodeAction(
		  	ActionManager.NothingTrigger,
		  	() => {
		  		mesh.elevated = !mesh.elevated;
		  	}
		  ));
			this.meshes.push(mesh);
		}, this);

		/* Shadows */
    let shadowGenerator = new ShadowGenerator(1024, sunLight);
		shadowGenerator.useBlurVarianceShadowMap = true;
		shadowGenerator.getShadowMap().renderList = 
			shadowGenerator.getShadowMap().renderList.concat(this.meshes);

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

	onLoaded () {
		this.onCreate();
	}

	onCreate() {
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
}