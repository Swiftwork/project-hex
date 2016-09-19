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
    /* Base Geometry */
    const tileMesh = {
      base: <Mesh> this.game.assetsManager.get(`mesh-hex-bottom`),
      plain: <Mesh> this.game.assetsManager.get(`mesh-hex-plain`),
    }

    /* Cached meshes */
    const firstInstance = {}

    /* Unexplored mesh
    const unexploredMesh = MeshBuilder.CreateCylinder(`tile-unexplored`, {
      height: 0.05,
      diameter: this.world.layout.size.x * 2 - 0.05,
      tessellation: 6,
    }, this.scene);
    */

    let base, surface;
    base = tileMesh.base.clone(`tile-unexplored`);
    surface = tileMesh.base.clone(`tile-unexplored`);
    base.setEnabled(false);
    surface.setEnabled(false);
    base.visibility = surface.visibility = 0.4;
    firstInstance['unexplored'] = { base: base, surface: surface, };

    /* Loop through world tiles and generate meshes */
    this.world.tiles.forEach( (tile: Tile) => {
      const id = `tile-${tile.hexagon.toString()}`;

      /* Explored tile */
      if (tile.isExplored) {
        if (!firstInstance[tile.type]) {
          /*
          mesh = MeshBuilder.CreateCylinder(id, {
            height: 0.05,
            diameter: this.world.layout.size.x * 2 - 0.05,
            tessellation: 6,
            faceUV: [new Vector4(0, 0, 0, 0), new Vector4(0, 0, 6, 0.1), new Vector4(0, 0, 1, 1)],
          }, this.scene);
          */
          base = tileMesh.base.clone(id);
          surface = tileMesh.plain.clone(id);
          base.material = surface.material = this.materialManager.get(tile.type);
          surface.receiveShadows = true;

          /* Add to cache */
          firstInstance[tile.type] = { base: base, surface: surface, };
          
          //this.meshes.push(mesh);
        } else {
          /* Create new clone of cached tile */
          base = firstInstance[tile.type].base.clone(id);
          surface = firstInstance[tile.type].surface.clone(id);
          console.log(base);
        }

        /* Create nature on tile */
        this.createEnvironment(tile);
        this.createUnit(tile);

        if (tile.isVisible) {
          /* Create buildings on tile */
          this.createStructure(tile);
        } else {
          //this.sunLight.excludedMeshes.push(base);
          //this.sunLight.excludedMeshes.push(surface);
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

      } else {
        base = firstInstance['unexplored'].base.createInstance(id);
        surface = firstInstance['unexplored'].surface.createInstance(id);
      }

      base.position = this.game.settings.world.layout.hexagonToPixel(tile.hexagon, 0)
      surface.position = this.game.settings.world.layout.hexagonToPixel(tile.hexagon, 0.093);
      base.scaling = surface.scaling = new Vector3(0.8,0.8,0.8);
      base.rotation = surface.rotation = new Vector3(0, Math.PI / 2, 0);
    }, this);
  }

  //------------------------------------------------------------------------------------
  // MESH CREATORS
  //------------------------------------------------------------------------------------

  createEnvironment(tile: Tile): void {
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
  
  createStructure(tile: Tile): void {
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

  createUnit(tile: Tile): void {
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
}