import {

} from 'babylonjs';
import * as P2P from 'socket.io-p2p';
import * as io from 'socket.io-client';

import Game from '../Game';

export default class NetworkClient {

  static TYPE = {
    HOST: 0,
    CLIENT: 1,
    SPECTATOR: 2,
  }

  private socket: SocketIOClient.Socket;
  private p2p: any;
  private type: number;

  public max = 10;
  public clients: Set<number>;

  constructor(private game: Game) {
    this.clients = new Set<number>();
  }

  public connect(type: number) {
    this.type = type;
    this.socket = io.connect('localhost:3000');
    this.p2p = new P2P(this.socket, { numClients: this.max }, () => {
      console.log('Network connection established');
      switch (type) {
        case NetworkClient.TYPE.HOST:
          break;
        case NetworkClient.TYPE.CLIENT:
          break;
        case NetworkClient.TYPE.SPECTATOR:
          break;
      }
      this.send({

      });
    });

    this.p2p.on('message', this.recieve.bind(this));
  }

  public recieve(data) {
    console.log(JSON.parse(data));
  }

  public send(data) {
    this.p2p.emit('message', JSON.stringify(data));
  }
}