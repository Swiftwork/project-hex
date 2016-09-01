import Entity from './Entity';

export default class Structure extends Entity {
	
	constructor(public id: string, public type: string) {
		super(id, type);
	}
}