import Hexagon from '../Math/Hexagon';

export default class Tile {

	public static TYPES = {
		BARREN: 'barren',
		PLAIN: 'plain',
		DESERT: 'desert',
		OCEAN: 'ocean',
		MOUNTAIN: 'mountain'
	};

	public explored = false;

	constructor(
		public hexagon: Hexagon,
		public type?: string
	) {
		if (typeof type === 'undefined') {
			const types = Object.keys(Tile.TYPES);
			this.type = Tile.TYPES[types[types.length * Math.random() << 0]];
		}
	}
}