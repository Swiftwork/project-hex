import { Control, InputText, StackPanel } from 'babylonjs-gui';

import Game from '../Game';
import Message from '../Logic/Message';
import NetworkClient from '../Network/NetworkClient';
import Label from './Label';

export default class Chat extends StackPanel {

  private messages: Map<string, Message>;

  public textfield: InputText;

  /* STATES */
  public isFocused = false;

  constructor(public name: string, public game: Game) {
    super(name);

    this.messages = new Map<string, Message>();
    this.textfield = new InputText('new-message', 'Chat with your friends!');
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
      let label = new Label(this.formatTime(message.date), `[${this.formatTime(message.date)}] ${message.text}`);
      this.messages.set(`message-${message.date.getTime()}`, message);
      this.addControl(label);
    }
    this.textfield.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  }

  private formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes);
  }
}
