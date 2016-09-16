import {
  Vector2, Vector3, Vector4,
  Color3, Color4,
  Mesh, MeshBuilder,
  Scene, ArcRotateCamera,
  DirectionalLight, ShadowGenerator,
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
  private sunLight: DirectionalLight;
  private meshes: Mesh[];

  constructor(
    private game: Game,
    private world: GameWorld,
    private scene: Scene
  ) {
    /* Scene Defaults */
    this.scene.clearColor = new Color3(0.9, 0.87, 0.85);
    this.scene.fogColor = this.scene.clearColor;
    //this.scene.fogMode = Scene.FOGMODE_LINEAR;
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

    /* Lights */
    this.sunLight = this.lightManager.get('sunLight');

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
    let shadowGenerator = new ShadowGenerator(8192, this.sunLight);
    shadowGenerator.bias = 0.0001;
    //shadowGenerator.useBlurVarianceShadowMap = true;
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
    this.mainCamera.panningSensibility = 10 * (this.mainCamera.upperRadiusLimit / this.mainCamera.radius);
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
    /* Cached meshes */
    const firstInstance = {}

    /* Unexplored mesh */
    const unexploredMesh = MeshBuilder.CreateCylinder(`tile-unexplored`, {
      height: 0.05,
      diameter: this.world.layout.size.x * 2 - 0.05,
      tessellation: 6,
    }, this.scene);
    unexploredMesh.setEnabled(false);
    unexploredMesh.visibility = 0.4;
    firstInstance['unexplored'] = unexploredMesh;

    /* Loop through world tiles and generate meshes */
    this.world.tiles.forEach( (tile: Tile) => {
      const id = `tile-${tile.hexagon.toString()}`;
      let mesh;

      /* Explored tile */
      if (tile.isExplored) {
        if (!firstInstance[tile.type]) {
          mesh = MeshBuilder.CreateCylinder(id, {
            height: 0.05,
            diameter: this.world.layout.size.x * 2 - 0.05,
            tessellation: 6,
            faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)],
          }, this.scene);
          mesh.material = this.materialManager.get(tile.type);
          mesh.receiveShadows = true;

          /* Add to cache */
          firstInstance[tile.type] = mesh;
          //this.meshes.push(mesh);
        } else {
          /* Create new clone of cached tile */
          mesh = firstInstance[tile.type].clone(id);
        }

        /* Create nature on tile */
        this.createEnvironment(tile, mesh);
        this.createUnit(tile, mesh);

        if (tile.isVisible) {
          /* Create buildings on tile */
          this.createStructure(tile, mesh);
        } else {
          this.sunLight.excludedMeshes.push(mesh);
        }
        
        /* Tile actions */
        //mesh.edgesWidth = 2;
        mesh.overlayColor = new Color3(0, 0, 1);
        mesh.overlayAlpha = 0.3;
        mesh.actionManager = new ActionManager(this.scene);
        mesh.actionManager.registerAction(new SwitchBooleanAction(
          ActionManager.OnPickTrigger,
          mesh,
          'renderOverlay'
        ));

      } else {
        mesh = unexploredMesh.createInstance(id);
      }

      mesh.position = this.world.layout.hexagonToPixel(tile.hexagon, 0.025);
      mesh.rotation = new Vector3(0, Math.PI / 3, 0);
    }, this);
  }

  //------------------------------------------------------------------------------------
  // MESH CREATORS
  //------------------------------------------------------------------------------------

  createEnvironment(tile: Tile, parent: Mesh): void {
    /* Cached tiles */
    const firstInstance = {}
    let original, bounds, mesh;

    for (var i = 0; i < tile.environment.length; ++i) {
      const environment = tile.environment[i];
      const id = `tile-${tile.hexagon.toString()}-${environment.id}-${i}`;
      
      if (!firstInstance[environment.model]) {
        original = this.game.assetsManager.get(`mesh-${environment.model}`);
        mesh = original.clone(id);
        mesh.makeGeometryUnique();
        mesh.subMeshes = original.subMeshes;
        bounds = mesh.getBoundingInfo().boundingBox;
        if (!tile.isVisible)
          this.sunLight.excludedMeshes.push(mesh);
        firstInstance[environment.model] = mesh;
      } else {
        mesh = firstInstance[environment.model].createInstance(id);
      }

      mesh.position = environment.position;
      mesh.position.y = 0.05;
      this.meshes.push(mesh);
    }
  }
  
  createStructure(tile: Tile, parent: Mesh): void {
    if (tile.structure) {
      const original = this.game.assetsManager.get(`mesh-${tile.structure.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.createInstance(`tile-${tile.hexagon.toString()}-${tile.structure.id}`);
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, CameraManager.toRadians(125), 0);
      mesh.position = tile.structure.position;
      mesh.position.y = 0.05;
      this.meshes.push(mesh);
    }
  }

  createUnit(tile: Tile, parent: Mesh): void {
    if (tile.unit) {
      const original = this.game.assetsManager.get(`mesh-${tile.unit.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.createInstance(`tile-${tile.hexagon.toString()}-${tile.unit.id}`);
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, CameraManager.toRadians(125), 0);
      mesh.position = tile.unit.position;
      mesh.position.y = 0.05;
      this.meshes.push(mesh);
    }
  }
}