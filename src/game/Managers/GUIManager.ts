import {
	ScreenSpaceCanvas2D,
	Vector2,
} from 'babylonjs';
import View from '../GUI/View';

export default class GUIManager {
	
	private views: Map<string, View>;

	constructor(private gui: ScreenSpaceCanvas2D) {
		this.views = new Map<string, View>();
	}

	public add(id: string, position: Vector2): View {
		const gui = new View(id, position);
		return gui;
	}

	public get(name: string): View {
		return this.views.get(name);
	}
}