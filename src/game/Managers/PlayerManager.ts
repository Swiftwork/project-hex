import {
	Scene,
	Vector3,
} from 'babylonjs';

export default class AssetsManager {
	
	private players: Map<string, any>;

	constructor(private scene: Scene) {

		this.players = new Map<string, any>();

	}

	public add(id: string, type: number, options: any): any {
		let player;
		for (var option in options) {
		  if (options.hasOwnProperty(option)) {
		  	player[option] = options[option];
		  }
		}
		this.players.set(id, player);
		return player;
	}

	public get(id: string): any {
		return this.players.get(id);
	}
}