import { Image } from 'babylonjs-gui';

import asset from '../Assets/interfaces/compass.svg';

export default class Compass extends Image {

  constructor(
    public name: string,
  ) {
    super(name, asset);
    this.width = '256px';
    this.height = '256px';
  }
}
