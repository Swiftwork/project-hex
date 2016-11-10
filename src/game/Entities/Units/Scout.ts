import Unit, { IUnit } from '../Unit';

export interface IScout extends IUnit {

}

export default class Scout extends Unit implements IScout {

  constructor(
    public id: string,
    public tileId: number,
    public model?: string
  ) {
    super(id, tileId, model);
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IScout | string): Scout {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Scout.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Scout.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}