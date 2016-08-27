export default class Hash {

	public static toHash(obj: any): number {
		const str = obj.toString();
	  var hash = 0, i, chr, len;
	  if (str.length === 0) return hash;
	  for (i = 0, len = str.length; i < len; i++) {
	    chr = str.charCodeAt(i);
	    hash = ((hash << 5) - hash) + chr;
	    hash |= 0;
	  }
	  return hash;
	}

	public static combine(...h: number[]): number {
		let hash = 0;
		for (var i = 0; i < h.length; ++i) {
			hash ^= h[i] + 0x9e3779b9 + (hash << 6) + (hash >> 2);
		}
		return hash;
	}
}