import Game from '../Game';
import { Control } from 'babylonjs-gui';

/* VIEWS */

export default class GuiManager {

  private views: Map<string, Control>;

  constructor(private game: Game) {
    this.views = new Map<string, Control>();
  }

  public add(id: string, view: Control): Control {
    this.views.set(id, view);
    return view;
  }

  public get(name: string): Control {
    return this.views.get(name);
  }
}
