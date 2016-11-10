import {

} from 'babylonjs';

export interface IMessage {
  text: string;
  sender: string;
  date: Date;
}

export default class Message implements IMessage {

  constructor(
    public text: string,
    public sender: string,
    public date: Date
  ) {

  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IMessage | string): Message {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Message.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Message.prototype), json, {
        date: new Date(json.date),
      });
    }
  }
}