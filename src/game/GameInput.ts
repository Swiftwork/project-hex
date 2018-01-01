import { HighlightLayer, Mesh, Vector2, ActionEvent, InstancedMesh, Color3, EventState, Size, ISize } from 'babylonjs';

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
  public path: Line[] = [];

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

    this.path.forEach((line) => {
      this.game.textureOverlay.removeControl(line);
    });
    this.path.length = 0;

    const overlaySize = this.game.textureOverlay.getSize();
    const tileSize = overlaySize.width / this.world.settings.size / 2;

    // https://www.babylonjs-playground.com/#XCPP9Y#370

    /* Movement */
    this.path = this.logic.getPath(this.selection.tile, tile).map((tile, index, tiles) => {
      if (index == tiles.length - 1) return undefined;
      let point = this.normalizePoint(this.world.settings.layout.hexagonToPixel(tile.hexagon) as Vector2, tileSize, overlaySize);
      let nextPoint = this.normalizePoint(this.world.settings.layout.hexagonToPixel(tiles[index + 1].hexagon) as Vector2, tileSize, overlaySize);
      let line = new Line(`line-${tile.id}`);
      line.x1 = point.x;
      line.y1 = point.y;
      line.x2 = nextPoint.x;
      line.y2 = nextPoint.y;
      line.lineWidth = 2;
      line.color = "cyan";
      this.game.textureOverlay.addControl(line);
      return line;
    });
    this.path.length--;
  }

  private normalizePoint(point: Vector2, tileSize: number, overlaySize: ISize) {
    // Center to middle of overlay
    let normalized = new Vector2(overlaySize.width / 2, overlaySize.height / 2);
    // Flip x value
    normalized = normalized.add(point.multiplyByFloats(-tileSize, tileSize));
    return normalized;
  }

  //------------------------------------------------------------------------------------
  // GENERAL INPUT EVENTS
  //------------------------------------------------------------------------------------

  private onChatClick(eventData: Vector2WithInfo, eventState: EventState) {
    this.chat.isFocused = true;
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.chat.isFocused) {
      switch (event.keyCode) {
        case 13:
          event.preventDefault();
          this.chat.sendMessage();
          return true;
      }

    } else {
      switch (event.keyCode) {
        case 70: // Keycode f
          this.game.graphics.switchFullscreen();
          return true;

<<<<<<< HEAD
        case 192: // Keycode §
        case 220: // Keycode §
=======
        case 192:
        case 220:
>>>>>>> 48f7b078b050924d74eb2b8b0e1a7111ca62a139
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
