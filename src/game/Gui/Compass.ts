import { Image } from 'babylonjs-gui';

export default class Compass extends Image {

  constructor(
    public name: string,
    public url: string,
  ) {
    super(name, url);
    this.width = 256;
    this.height = 256;
  }
}
