import Structure, { IStructure } from '../Structure';

export interface IBase extends IStructure {
  stage: number
}

export default class Base extends Structure implements IBase {

  public stage = 0;

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

  static fromJSON(json: IBase | string): Base {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Base.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Base.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}