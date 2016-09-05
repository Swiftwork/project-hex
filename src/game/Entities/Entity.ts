import {
	Vector3,
} from 'babylonjs';

export default class Entity {

	public position: Vector3;
	
	constructor(public id: string, public type: string) {
		this.position = new Vector3(0, 0, 0);
	}
}