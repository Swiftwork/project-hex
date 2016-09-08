import Entity from './Entity';

export default class Structure extends Entity {
  
  constructor(public id: string, public model?: string) {
    super(id, model);
  }
}