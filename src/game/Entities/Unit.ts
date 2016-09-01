import Entity from './Entity';

export default class Unit extends Entity {
	
	constructor(public id: string, public type: string) {
		super(id, type);
	}
}