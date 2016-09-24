import {
  Vector2, Vector3, Vector4,
  Color3, Color4, StandardMaterial,
  Mesh, MeshBuilder,
  Scene, ArcRotateCamera,
  DirectionalLight, ShadowGenerator,
  ActionManager, InterpolateValueAction, ExecuteCodeAction, SwitchBooleanAction,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import Tile from './Logic/Tile';
import GUIManager from './Managers/GUIManager';
import CameraManager from './Managers/CameraManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';

export default class GameRenderer {

  /* MANAGERS */
  private guiManager: GUIManager;
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
    this.guiManager = new GUIManager(this.game.gui);
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
    this.renderTable();
    this.renderTiles();
    this.scene.createOrUpdateSelectionOctree();

    /* Shadows */
    let shadowGenerator = new ShadowGenerator(8192, this.sunLight);
    shadowGenerator.bias = 0.0000005;
    shadowGenerator.usePoissonSampling = true;
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

  //------------------------------------------------------------------------------------
  // GAME BOARD MESH RENDERERS
  //------------------------------------------------------------------------------------

  private renderTable(): void {
    let table = Mesh.CreateGround('table', this.game.settings.world.size * 2, this.game.settings.world.size * 2, 2, this.scene);
    table.material = this.materialManager.get('paper');
    table.receiveShadows = true;
  }

  private renderTiles(): void {
    /* Cached meshes */
    const cache = {}

    /* Unexplored mesh */
    cache['unexplored'] = {
      base: this.game.assetsManager.get(`mesh-hex-bottom`).clone(`tile-unexplored-base`),
      surface: this.game.assetsManager.get(`mesh-hex-plain`).clone(`tile-unexplored-surface`),
    };
    cache['unexplored'].base.setEnabled(false);
    cache['unexplored'].surface.setEnabled(false);
    cache['unexplored'].base.visibility = cache['unexplored'].surface.visibility = 0.4;
    cache['unexplored'].base.material = cache['unexplored'].surface.material = this.materialManager.get('unexplored');

    /* Loop through world tiles and generate meshes */
    this.world.tiles.forEach( (tile: Tile) => {
      const id = `tile-${tile.hexagon.toString()}`;
      let base: Mesh, surface: Mesh;

      /* Explored tile */
      if (tile.isExplored) {
        if (!cache[tile.type]) {
          /* faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)] */
          base = this.game.assetsManager.get(`mesh-hex-bottom`).clone(`${id}-base`);
          surface = this.game.assetsManager.get(`mesh-${tile.surface}`).clone(`${id}-surface`);
          base.material = surface.material = this.materialManager.get(tile.type);
          base.receiveShadows = surface.receiveShadows = true;

          /* Add to cache */
          cache[tile.type] = {
            base: base,
            surface: surface,
          };
        } else {
          /* Render new clone of cached tile */
          base = cache[tile.type].base.clone(`${id}-base`);
          surface = cache[tile.type].surface.clone(`${id}-surface`);
        }

        /* Render nature on tile */
        this.renderEnvironment(tile);

        if (tile.isVisible) {
          /* Render buildings on tile */
          this.renderStructure(tile);
          /* Render units on tile */
          this.renderUnit(tile);
        } else {
          /* Darken hidden tiles */
          this.sunLight.excludedMeshes.push(base);
          this.sunLight.excludedMeshes.push(surface);
        }
        
        /* Tile actions
        //mesh.edgesWidth = 2;
        surface.overlayColor = new Color3(0, 0, 1);
        surface.overlayAlpha = 0.3;
        surface.actionManager = new ActionManager(this.scene);
        surface.actionManager.registerAction(new SwitchBooleanAction(
          ActionManager.OnPickTrigger,
          surface,
          'renderOverlay'
        ));
        */

        base.position = this.game.settings.world.layout.hexagonToPixel(tile.hexagon, 0)
        surface.position = base.position.clone();
        surface.position.y = 0.093;
        base.rotation = surface.rotation = new Vector3(0, Math.PI / 2, 0);
        base.scaling = surface.scaling = new Vector3(0.93, 0.93, 0.93);
        this.meshes.push(surface);
      } else {
        //base = cache['unexplored'].base.clone(`${id}-base`);
        //surface = cache['unexplored'].surface.clone(`${id}-surface`);
      }
    }, this);
  }

  //------------------------------------------------------------------------------------
  // TILE MESH ENTITY RENDERERS
  //------------------------------------------------------------------------------------

  private renderEnvironment(tile: Tile): void {
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
      mesh.position.y = 0.1;
      this.meshes.push(mesh);
    }
  }
  
  private renderStructure(tile: Tile): void {
    if (tile.structure) {
      const original = this.game.assetsManager.get(`mesh-${tile.structure.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.createInstance(`tile-${tile.hexagon.toString()}-${tile.structure.id}`);
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, CameraManager.toRadians(125), 0);
      mesh.position = tile.structure.position;
      mesh.position.y = 0.1;
      this.meshes.push(mesh);
    }
  }

  private renderUnit(tile: Tile): void {
    if (tile.unit) {
      const original = this.game.assetsManager.get(`mesh-${tile.unit.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.createInstance(`tile-${tile.hexagon.toString()}-${tile.unit.id}`);
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, CameraManager.toRadians(125), 0);
      mesh.position = tile.unit.position;
      mesh.position.y = 0.1;
      this.meshes.push(mesh);
    }
  }

  //------------------------------------------------------------------------------------
  // INTERFACE RENDERERS
  //------------------------------------------------------------------------------------

  private renderInterface(): void {
  }
}