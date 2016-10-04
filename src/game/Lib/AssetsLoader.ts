import {
  Scene, SceneLoader,
  AbstractMesh, ParticleSystem, Skeleton,
  Texture,
  IAssetTask, Tools,
  AssetsManager,
} from 'babylonjs';

const FontFaceObserver = require('fontfaceobserver');

export class FontFileAssetTask implements IAssetTask {
  public onSuccess: (task: IAssetTask) => void;
  public onError: (task: IAssetTask) => void;

  public isCompleted = false;

  constructor(public name: string, public fontName: string) {
  }

  public run(scene: Scene, onSuccess: () => void, onError: () => void) {
    const font = new FontFaceObserver(this.fontName);

    font.load().then(() => {
      this.isCompleted = true;

      if (this.onSuccess) {
        this.onSuccess(this);
      }

      onSuccess();
    }, () => {
      if (this.onError) {
        this.onError(this);
      }

      onError();
    });
  }
}

export default class AssetsLoader extends AssetsManager {

  constructor(scene: Scene) {
    super(scene);
  }

  public addFontAssetTask(taskName: string, url: string): IAssetTask {
    var task = new FontFileAssetTask(taskName, url);
    this.tasks.push(task);

    return task;
  }
}
