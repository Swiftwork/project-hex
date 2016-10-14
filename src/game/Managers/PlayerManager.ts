import {
  Scene,
  Vector3,
} from 'babylonjs';

import Game from '../Game';
import Player from '../Actors/Player';

export default class PlayerManager {

  private players: Map<string, Player>;
  private teams: Map<string, Player[]>;
  private localPlayer: Player;

  constructor(private game: Game) {
    this.players = new Map<string, Player>();
    this.teams = new Map<string, Player[]>();
  }

  public add(name: string, type: number, teamName?: string): Player {
    const player = new Player(name, type);
    if (player.type === Player.TYPES.LOCAL)
      this.localPlayer = player;
    this.players.set(name, player);
    if (teamName && this.teams.get(teamName))
      this.teams.get(teamName).push(player);
    else if (teamName)
      this.teams.set(teamName, [player]);
    return player;
  }

  public get(name: string): Player {
    return this.players.get(name);
  }

  public getLocal(): Player {
    return this.localPlayer;
  }

  public getTeams(teamName: string): Player[] {
    return this.teams.get(teamName);
  }
}