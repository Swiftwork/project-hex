import {

} from 'babylonjs-nightly';
import * as P2P from 'socket.io-p2p';
import * as io from 'socket.io-client';

export default class NetworkClient {

  private socket: SocketIOClient.Socket;
  private p2p: any;

  constructor() {
    this.socket = io.connect('localhost:3000');

    this.p2p = new P2P(this.socket, { numClients: 10 }, () => {
      console.log('Connected to the other clients');
      this.p2p.emit('peer-msg', 'Hi there, this is client ' + this.p2p.peerId)
    });

    this.p2p.on('peer-msg', (data) => {
      console.log(data);
    });
  }
}