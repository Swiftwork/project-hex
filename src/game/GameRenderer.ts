import {
  Vector2, Vector3, Vector4,
  Color3, Color4, StandardMaterial, ShaderMaterial,
  Mesh, MeshBuilder, InstancedMesh, AbstractMesh,
  Scene, ArcRotateCamera,
  DirectionalLight, ShadowGenerator,
  ActionManager, InterpolateValueAction, ExecuteCodeAction, SwitchBooleanAction, ActionEvent,
  HighlightLayer,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import CustomMeshes from './Math/CustomMeshes';
import Tile from './Entities/Tile';
import CameraManager from './Managers/CameraManager';

export default class GameRenderer {

  /* GENERAL */
  private mainCamera: ArcRotateCamera;
  private sunLight: DirectionalLight;
  private meshes: Mesh[];

  /* SHADOWS & HIGHLIGHTS */
  private highlights: HighlightLayer;
  private shadowGenerator: ShadowGenerator;

  constructor(
    private game: Game,
    private world: GameWorld
  ) {
    /* Scene Defaults */
    this.game.scene.clearColor = new Color3(0.9, 0.87, 0.85);
    this.game.scene.fogColor = this.game.scene.clearColor;
    //this.game.scene.fogMode = Scene.FOGMODE_LINEAR;
    this.game.scene.fogStart = 10;
    this.game.scene.fogEnd = 15;

    /* Cameras */
    this.mainCamera = <ArcRotateCamera>this.game.cameraManager.get('main');
    this.mainCamera.setTarget(Vector3.Zero());
    this.mainCamera.attachControl(this.game.canvas, false, false);

    /* Lights */
    this.sunLight = this.game.lightManager.get('sunLight');

    /* Tile Storage */
    this.meshes = [];

    /* Scene Actions */
    this.game.scene.actionManager = new ActionManager(this.game.scene);
    this.game.scene.actionManager.registerAction(new ExecuteCodeAction(
      ActionManager.OnKeyDownTrigger,
      (event) => {
        /* Debug */
        if (event.sourceEvent.keyCode === 192) {
          if (!this.game.scene.debugLayer.isVisible())
            this.game.scene.debugLayer.show();
          else
            this.game.scene.debugLayer.hide();
        }
      }
    ));
  }

  onCreate() {
    /* Highlights */
    this.highlights = new HighlightLayer('highlights', this.game.scene, {});

    /* Shadows */
    this.shadowGenerator = new ShadowGenerator(4096, this.sunLight);
    this.shadowGenerator.bias = 0.0000009;
    this.shadowGenerator.usePoissonSampling = true;
    //this.shadowGenerator.useBlurVarianceShadowMap = true;
    this.shadowGenerator.getShadowMap().refreshRate = 0;

    /* Creators */
    this.renderSky();
    this.renderTable();
    this.renderTiles();
    this.game.scene.createOrUpdateSelectionOctree();

    /* Shadowed Meshes */
    this.shadowGenerator.getShadowMap().renderList =
      this.shadowGenerator.getShadowMap().renderList.concat(this.meshes);
  }

  onResume() {
  }

  onUpdate() {
    this.mainCamera.panningSensibility = this.mainCamera.upperRadiusLimit * (this.mainCamera.upperRadiusLimit / this.mainCamera.radius);
  }

  onPause() {
  }

  onDestroy() {

  }

  //------------------------------------------------------------------------------------
  // GAME BOARD MESH RENDERERS
  //------------------------------------------------------------------------------------

  private renderSky() {
    const skybox = Mesh.CreateBox('skybox', 100.0, this.game.scene);
    skybox.material = this.game.materialManager.get('sky');
    skybox.position = new Vector3(0, -0.1, 0);
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0;
  }

  private renderTable() {
    let base = Mesh.CreateGround('table', this.world.settings.size * 2, this.world.settings.size * 2, 2, this.game.scene);
    base.material = this.game.materialManager.get('felt');
    base.receiveShadows = true;


    const edge = CustomMeshes.CreateFrame('table-frame', {
      length: this.world.settings.size * 2,
      depth: this.world.settings.size * 2,
      height: 0.6,
      thickness: 2,
      alignment: CustomMeshes.ALIGNMENT.OUTSIDE,
    }, this.game.scene);
    edge.material = this.game.materialManager.get('wood');

    base.renderingGroupId = edge.renderingGroupId = 1;
    this.meshes.push(edge);
  }

  private renderTiles() {
    /* Cached meshes */
    const cache = {}

    /* Unexplored mesh */
    cache['unexplored'] = {
      base: this.game.assetManager.get(`mesh-hex-bottom`).clone(`tile-unexplored-base`),
      surface: this.game.assetManager.get(`mesh-hex-plain`).clone(`tile-unexplored-surface`),
    };
    cache['unexplored'].base.setEnabled(false);
    cache['unexplored'].surface.setEnabled(false);
    cache['unexplored'].base.visibility = cache['unexplored'].surface.visibility = 0.4;
    cache['unexplored'].base.material = cache['unexplored'].surface.material = this.game.materialManager.get('unexplored');

    /* Loop through world tiles and generate meshes */
    this.world.tiles.forEach((tile: Tile) => {
      const id = `tile-${tile.hexagon.toString()}`;
      let base: Mesh, surface: Mesh;

      /* Explored tile */
      if (tile.isExplored) {
        if (!cache[tile.type]) {
          base = this.game.assetManager.get(`mesh-hex-bottom`).clone(`${id}-base`);
          surface = this.game.assetManager.get(`mesh-${tile.surface}`).clone(`${id}-surface`, base);

          /* Add to cache */
          cache[tile.type] = {
            base: base,
            surface: surface,
          };
        } else {
          /* Render new clone of cached tile */
          base = cache[tile.type].base.clone(`${id}-base`, null, true);
          surface = cache[tile.type].surface.clone(`${id}-surface`, base, true);
        }

        /* Render nature on tile */
        this.renderEnvironment(tile, surface);

        if (tile.isVisible) {
          /* Regular texture */
          base.material = surface.material = this.game.materialManager.get(tile.type);
          /* Render buildings on tile */
          this.renderStructure(tile, surface);
          /* Render units on tile */
          this.renderUnit(tile, surface);
        } else {

          /* Darken hidden tiles */
          base.material = surface.material = this.game.materialManager.get(`${tile.type}-hidden`);
          (<ShaderMaterial>base.material).setVector3('cameraPosition', this.game.cameraManager.get('main').position);
        }

        /* Tile actions */
        base.isPickable = true;
        base.actionManager = new ActionManager(this.game.scene);
        base.actionManager.registerAction(new ExecuteCodeAction(
          ActionManager.OnPickTrigger,
          (event: ActionEvent) => {
            base.getChildMeshes().concat(base).forEach((mesh: Mesh, index: number) => {
              if (mesh instanceof InstancedMesh)
                return;
              if (base.state === 'selected')
                this.highlights.removeMesh(mesh);
              else
                this.highlights.addMesh(mesh, new Color3(0.9, 0.2, 0.8));
            }, this);
            base.state = base.state === 'selected' ? '' : 'selected';
          },
        ));

        base.position = this.world.settings.layout.hexagonToPixel(tile.hexagon, 0)
        surface.position = new Vector3(0, 0.1, 0);
        base.rotation = new Vector3(0, Math.PI / 2, 0);
        base.scaling = new Vector3(0.93, 0.93, 0.93);
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

  private renderEnvironment(tile: Tile, parent: Mesh) {
    /* Cached tiles */
    const firstInstance = {}
    let original: Mesh, bounds, mesh: Mesh;

    for (var i = 0; i < tile.environment.length; ++i) {
      const environment = tile.environment[i];
      const id = `tile-${tile.hexagon.toString()}-${environment.id}-${i}`;

      if (!firstInstance[environment.model]) {
        original = this.game.assetManager.get(`mesh-${environment.model}`);
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
      mesh.parent = parent;
      mesh.position = environment.position;
      mesh.position.y = 0;
      this.meshes.push(mesh);
    }
  }

  private renderStructure(tile: Tile, parent: Mesh) {
    if (tile.structure) {
      const original = this.game.assetManager.get(`mesh-${tile.structure.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.clone(`tile-${tile.hexagon.toString()}-${tile.structure.id}`);
      mesh.parent = parent;
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, this.game.graphics.toRadians(90), 0);
      mesh.position = tile.structure.position;
      this.meshes.push(mesh);
    }
  }

  private renderUnit(tile: Tile, parent: Mesh) {
    if (tile.unit) {
      const original = this.game.assetManager.get(`mesh-${tile.unit.model}`);
      const bounds = original.getBoundingInfo().boundingBox;
      let mesh = original.clone(`tile-${tile.hexagon.toString()}-${tile.unit.id}`);
      mesh.parent = parent;
      mesh.scaling = new Vector3(0.9, 0.9, 0.9);
      mesh.rotation = new Vector3(0, this.game.graphics.toRadians(90), 0);
      mesh.position = tile.unit.position;
      this.meshes.push(mesh);
    }
  }
}