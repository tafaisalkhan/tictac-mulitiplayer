import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GameProvider } from '../game/game';

/*
  Generated class for the GamelogicProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GamelogicProvider {
  playWin: any ;
  playerOneScore: number = 0;
  playerTwoScore: number = 0;
  tie:boolean = true;
  result: Boolean = false;
  winner ;
  gameOverDiv: string = "hidden";
  tieCount: number = 0;
  playerTrue:Boolean = false;
  loading: Boolean = false;
  normalGameAITrue: boolean = true;
 
  constructor(public gameProvider:GameProvider) {
   
  }



bestSpot() {

  //return this.minimax(this.gameProvider.origBoard, this.gameProvider.aiPlayer).index;
}

emptySquares() {
  return this.gameProvider.origBoard.filter(s => typeof s == 'number');
}


generateRandomNo(){
  let ramArray = [];
  for (var i = 0 ; i<= this.gameProvider.origBoard.length; i++ ){
    if (typeof this.gameProvider.origBoard[i] == 'number'){
      ramArray.push(this.gameProvider.origBoard[i]);
    }
        
  } 
  var ran = Math.floor((Math.random() * ramArray.length));
  var tmp = ramArray[ran]
  return tmp;
}

/*
  minimax(newBoard, player) {
    var availSpots = this.emptySquares();
  
    if (this.checkWin(newBoard, this.gameProvider.huPlayer)) {
      return {score: -10};
    } else if (this.checkWin(newBoard, this.gameProvider.aiPlayer)) {
      return {score: 10};
    } else if (availSpots.length === 0) {
      return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {index:'' , score: ''};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;
  
      if (player == this.gameProvider.aiPlayer) {
        var result = this.minimax(newBoard, this.gameProvider.huPlayer);
        move.score = result.score;
      } else {
        var result = this.minimax(newBoard, this.gameProvider.aiPlayer);
        move.score = result.score;
      }
  
      newBoard[availSpots[i]] = move.index;
  
      moves.push(move);
    }
  
    var bestMove;
    if(player === this.gameProvider.aiPlayer) {
      var bestScore = -1000;
      for(var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 1000;
      for(var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  
      return moves[bestMove];
    }*/
}
