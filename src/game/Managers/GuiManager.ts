import Game from '../Game';

/* VIEWS */

export default class GuiManager {

  private views: Map<string, Prim2DBase>;

  constructor(private game: Game) {
    this.views = new Map<string, Prim2DBase>();
  }

  public add(id: string, view: Prim2DBase): Prim2DBase {
    this.views.set(id, view);
    return view;
  }

  public get(name: string): Prim2DBase {
    return this.views.get(name);
  }
}
