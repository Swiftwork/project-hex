import {
  Size,
  Group2D, StackPanelLayoutEngine,
} from 'babylonjs';

import Game from '../Game';
import Message from '../Logic/Message';
import NetworkClient from '../Network/NetworkClient';
import Label2D from './Label2D';

export default class Chat2D extends Group2D {

  private messages: Map<string, Message>;

  public textfield: Label2D;

  /* STATES */
  public isFocused = false;

  constructor(private game: Game, public settings?: any) {
    super(settings = Object.assign({
      /* Defaults */
      layoutEngine: StackPanelLayoutEngine.Vertical,
    }, settings, {
        /* Overrides */
      })
    );
    this.settings = settings;

    this.messages = new Map<string, Message>();
    this.textfield = new Label2D('', null, {
      id: `new-message`,
      parent: this,
      size: new Size(this.actualWidth, this.game.graphics.dpToPx(32)),
    });
  }

  public sendMessage() {
    const message = new Message(
      this.textfield.text,
      this.game.playerManager.getLocal().name,
      new Date(),
    );
    this.addMessage(message);
    this.game.network.send(NetworkClient.LAYER.MESSAGE, message);
    this.textfield.text = '';
  }

  public addMessage(...messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      let label = new Label2D(`[${this.formatTime(message.date)}] ${message.text}`, null, {
        id: `message-${message.date.getTime()}`,
        parent: this,
      });
      this.messages.set(`message-${message.date.getTime()}`, message);
      label.moveToBottom();
    }
    this.textfield.moveToBottom();
  }

  private formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes);
  }
}