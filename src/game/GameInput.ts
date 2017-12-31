import { HighlightLayer, Mesh, Vector2, ActionEvent, InstancedMesh, Color3, EventState } from 'babylonjs';

import Tile from './Entities/Tile';
import Game from './Game';
import GameLogic from './GameLogic';
import GameWorld from './GameWorld';
import Chat from './Gui/Chat';
import { Line, Vector2WithInfo } from 'babylonjs-gui';

export default class GameInput {

  public highlights: HighlightLayer;
  public chat: Chat;

  /* STATES */
  public selection: { tile: Tile, mesh: Mesh, movement: Tile[] };

  constructor(
    private game: Game,
    private logic: GameLogic,
    private world: GameWorld
  ) {

    /* LISTENERS */
    this.onSelection = this.onSelection.bind(this);
    this.onChatClick = this.onChatClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onCreate() {
    /* Highlights */
    this.highlights = new HighlightLayer('highlights', this.game.scene);
    this.highlights.addExcludedMesh(<Mesh>this.game.sceneOverlay);

    this.chat = <Chat>this.game.guiManager.get('chat');
    this.chat.onPointerDownObservable.add(this.onChatClick);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keypress', this.onKeyPress);
  }

  onResume() {
  }

  onUpdate() {
  }

  onPause() {
  }

  onDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keypress', this.onKeyPress);
  }

  //------------------------------------------------------------------------------------
  // GAME INPUT EVENTS
  //------------------------------------------------------------------------------------

  public onSelection(tile: Tile, mesh: Mesh, event: ActionEvent) {
    this.selection = { tile: tile, mesh: mesh, movement: null };

    /* Highlight */
    mesh.state = mesh.state === 'selected' ? '' : 'selected';
    mesh.getChildMeshes().concat(mesh).forEach((child: Mesh, index: number) => {
      if (child instanceof InstancedMesh)
        return;
      if (mesh.state === 'selected')
        this.highlights.addMesh(child, new Color3(0.9, 0.2, 0.8));
      else
        this.highlights.removeMesh(child);
    }, this);

    /* Movement */
    const player = this.game.playerManager.getLocal();
    if (tile.unit && player.units.indexOf(tile.unit) !== -1) {
      this.selection.movement = this.logic.getReachable(tile, tile.unit.movement);
    }
  }

  public onHover(tile: Tile, mesh: Mesh, event: ActionEvent) {
    if (!this.selection || !this.selection.movement || this.selection.movement.indexOf(tile) === -1) return;

    /* Movement */
    let path = this.logic.getPath(this.selection.tile, tile).map((tile: Tile) => {
      return <Vector2>this.world.settings.layout.hexagonToPixel(tile.hexagon);
    });

    const straightLine = new Line('StraightLine');
    straightLine.x1 = 10;
    straightLine.y1 = 10;
    straightLine.x2 = 1000;
    straightLine.y2 = 500;
    straightLine.lineWidth = 5;
    straightLine.dash = [5, 10];
    straightLine.color = "white";
    this.game.textureOverlay.addControl(straightLine);

    /*
    var straightLine = new BABYLON.Lines2D(path, {
      parent: this.game.world2d, id: "StraightLine", x: 750, y: 50, fillThickness: 10, fill: "#8040C0FF", border: "#40FFFFFF",
      startCap: BABYLON.Lines2D.RoundAnchorCap, endCap: BABYLON.Lines2D.DiamondAnchorCap,
      borderThickness: 5, closed: false, origin: BABYLON.Vector2.Zero()
    });
    */
  }

  //------------------------------------------------------------------------------------
  // GENERAL INPUT EVENTS
  //------------------------------------------------------------------------------------

  private onChatClick(eventData: Vector2WithInfo, eventState: EventState) {
    this.chat.isFocused = true;
  }

  private onKeyDown(event: KeyboardEvent) {
    console.log('keydown');
    if (this.chat.isFocused) {
      switch (event.keyCode) {
        case 13:
          event.preventDefault();
          this.chat.sendMessage();
          return true;
      }

    } else {
      switch (event.keyCode) {
        case 70:
          this.game.graphics.switchFullscreen();
          return true;

        case 192:
          if (!this.game.scene.debugLayer.isVisible())
            this.game.scene.debugLayer.show();
          else
            this.game.scene.debugLayer.hide();
          return true;
      }
    }

    return false;
  }

  private onKeyPress(event: KeyboardEvent) {
  }
}
