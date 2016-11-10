import {

} from 'babylonjs';
import * as P2P from 'socket.io-p2p';
import * as io from 'socket.io-client';

import Game from '../Game';
import Message from '../Logic/Message';
import Chat2D from '../Canvas2D/Chat2D';

export default class NetworkClient {

  static TYPE = {
    HOST: 0,
    CLIENT: 1,
    SPECTATOR: 2,
  }

  static LAYER = {
    NETWORK: 'network',
    MESSAGE: 'message',
    ACTION: 'action',
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
      console.log('Network connection established as ' + type);
      switch (type) {
        case NetworkClient.TYPE.HOST:
          break;
        case NetworkClient.TYPE.CLIENT:
          this.send(NetworkClient.LAYER.NETWORK, {
            action: 'joined', client: this.p2p.peerId,
          });
          break;
        case NetworkClient.TYPE.SPECTATOR:
          this.send(NetworkClient.LAYER.NETWORK, {
            action: 'joined', client: this.p2p.peerId,
          });
          break;
      }
    });

    this.p2p.on('network', this.onNetwork.bind(this));
    this.p2p.on('message', this.onMessage.bind(this));
    this.p2p.on('action', this.onAction.bind(this));
  }

  public onNetwork(data: string) {
    console.log(JSON.parse(data));
  }

  public onMessage(data: string) {
    const chat = <Chat2D>this.game.canvas2DManager.get('chat');
    chat.addMessage(Message.fromJSON(data));
    console.log(JSON.parse(data));
  }

  public onAction(data: string) {
    console.log(JSON.parse(data));
  }

  public send(layer, data) {
    this.p2p.emit(layer, JSON.stringify(data));
  }
}