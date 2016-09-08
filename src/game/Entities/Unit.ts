import Entity from './Entity';

export default class Unit extends Entity {
  
  constructor(public id: string, public model?: string) {
    super(id, model);
  }
}