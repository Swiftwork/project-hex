import {
  ScreenSpaceCanvas2D,
  Vector2,
} from 'babylonjs';

/* VIEWS */
import View from '../GUI/View';
import Compass from '../GUI/View';

export default class GUIManager {
  
  private views: Map<string, View>;

  constructor(private canvas: ScreenSpaceCanvas2D) {
    this.views = new Map<string, View>();
  }

  public add(id: string, view: View): View {
    this.views.set('id', view);
    return view;
  }

  public get(name: string): View {
    return this.views.get(name);
  }
}