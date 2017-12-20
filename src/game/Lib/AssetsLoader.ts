import {
  Scene, SceneLoader,
  AbstractMesh, ParticleSystem, Skeleton,
  Texture,
  AbstractAssetTask, Tools,
  AssetsManager, CubeTextureAssetTask,
} from 'babylonjs';

const FontFaceObserver = require('fontfaceobserver');

export class FontFileAssetTask extends AbstractAssetTask {

  onSuccess: (task: FontFileAssetTask) => void;
  onError: (task: FontFileAssetTask, message?: string, exception?: any) => void;

  constructor(public name: string, public fontName: string) {
    super(name);
  }

  public runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void) {
    const font = new FontFaceObserver(this.fontName);

    font.load().then(() => {
      onSuccess();
    }, () => {
      onError('Error loading font');
    });
  }
}

export default class AssetsLoader extends AssetsManager {

  constructor(scene: Scene) {
    super(scene);
  }

  public addFontAssetTask(taskName: string, url: string): AbstractAssetTask {
    var task = new FontFileAssetTask(taskName, url);
    this.tasks.push(task);
    return task;
  }
}
