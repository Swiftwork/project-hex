import {

} from 'babylonjs';

export interface IAction {
  action: number;
}

export default class Action implements IAction {

  static ACTION = {
    MOVE: 0,
    BUILD: 1,
    DESTROY: 2,
  }

  constructor(public action: number) {

  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IAction | string): Action {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Action.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Action.prototype), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}