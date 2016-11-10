/*
export interface IExtendedMapEntry<K, V> {
  key: K;
  value: V;
}

export interface IExtendedMap<K, V> extends Map<K, V> {
  toJSON(): IExtendedMapEntry<K, V>[];
}

export default class ExtendedMap<K, V> implements IExtendedMap<K, V> {

  constructor() {
  }

  public toJSON(): IExtendedMapEntry<K, V>[] {
    let json = [];
    this.forEach((value: V, key: K) => {
      json.push({ key, value });
    });
    return json;
  }

  static fromJSON<K, V>(json: IExtendedMapEntry<K, V>[] | string, keyProto?: { new (): K; }, valueProto?: { new (): V; }): ExtendedMap<K, V> {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? ExtendedMap.fromJSON(value, keyProto, valueProto) : value;
      });
    } else {
      let map = new this<K, V>();
      json.map((entry: IExtendedMapEntry<K, V>) => {
        let key = !keyProto ? entry.key : Object.assign(Object.create(keyProto.prototype), entry.key);
        let value = !valueProto ? entry.value : Object.assign(Object.create(valueProto.prototype), entry.value);
        map.set(key, value);
      });
      return map;
    }
  }
}
*/