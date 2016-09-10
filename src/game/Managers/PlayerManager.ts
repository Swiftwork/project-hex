import {
	Scene,
	Vector3,
} from 'babylonjs';
import Player from '../Actors/Player';

export default class PlayerManager {
	
	private players: Map<string, Player>;

	constructor(private scene: Scene) {
		this.players = new Map<string, Player>();
	}

	public add(name: string, type: number, options?: any): Player {
		const player = new Player(name, type);
		for (var option in options) {
		  if (options.hasOwnProperty(option)) {
		  	player[option] = options[option];
		  }
		}
		this.players.set(name, player);
		return player;
	}

	public get(name: string): Player {
		return this.players.get(name);
	}
}