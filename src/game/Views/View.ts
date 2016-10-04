import {
  ScreenSpaceCanvas2D,
} from 'babylonjs';

export default class View {

  constructor(
    public id: string,
    public canvas: ScreenSpaceCanvas2D
  ) {
    
  }
}