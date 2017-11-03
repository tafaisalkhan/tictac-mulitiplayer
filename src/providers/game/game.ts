import { Injectable } from '@angular/core';

/*
  Generated class for the GameProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GameProvider {
  origBoard: number[]  = Array.from(Array(9).keys());
  huPlayer: string;
  aiPlayer: string;
  type: string = 'double'
  huUsername: string;
  aiUsername: string;
  winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

}
