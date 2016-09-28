import {
  Vector2,
} from 'babylonjs';
import Seed from '../Math/Seed';
import HexagonLayout from '../Math/HexagonLayout';

export default class Settings {
  seed: Seed;
  difficulty: number;
  paused: boolean;
  graphics: {
    dpr: number,
    quality: number;
  };
  world: {
    layout: HexagonLayout;
    size: number;
  };
};