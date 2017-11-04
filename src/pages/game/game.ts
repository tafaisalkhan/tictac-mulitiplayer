import { Component } from '@angular/core';
import { state, group, trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GameProvider } from '../../providers/game/game';
import { Media, MediaObject } from '@ionic-native/media';
import { LoadingController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
  animations:[  
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: 'auto',
        width: '300px'
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
 
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateX(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateX(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateX(0)',     offset: 1.0}),
          ]))]), {optional: true})
          ,
          query(':leave', stagger('300ms', [
            animate('1s ease-in', keyframes([
              style({opacity: 1, transform: 'translateX(0)', offset: 0}),
              style({opacity: .5, transform: 'translateX(35px)',  offset: 0.3}),
              style({opacity: 0, transform: 'translateX(-75%)',     offset: 1.0}),
            ]))]), {optional: true})
      ])
    ]),
    trigger('listAnimationCell', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
          ,
          query(':leave', stagger('300ms', [
            animate('1s ease-in', keyframes([
              style({opacity: 1, transform: 'translateY(0)', offset: 0}),
              style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
              style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
            ]))]), {optional: true})
      ])
    ]),
    trigger('visibilityGameOver', [
      state('shown' , style({ opacity: 1, display: 'block' ,  transform:'translateY(0%)'})),
      state('hidden', style({ opacity: 1, display: 'none' , transform:'translateY(-800%)' })),
      transition('* => *', animate('1s'))
    ]),
  ]
})

export class GamePage {
  cells;
  winner ;
  tableRow: any[] = [];
  tableCell: any[] =[] ;
  result: Boolean = false;
  loading: Boolean = false;
  gameOverDiv: string = "hidden";
  playerTrue:Boolean = true;
  playWin: any ;
  roomState: string;
  heightState: string = "fullHeight";
  showDiv: Boolean = true;
  roomWhiteState: string = "in";
  playerOneScore: number = 0;
  playerOnelossScore:number = 0;
  playerTwoScore: number = 0;
  playerTwoLossScore: number = 0;
  tie:boolean = true;
  normalGameAITrue: boolean = true;
  tieCount: number = 0;
  isPlay: boolean = false;
  file: MediaObject;
  fileTic: MediaObject;
  loader: any;
  socketData; any;
  valid: boolean = false;
  private messageFrom : FormGroup;
  alreadyDisconnected: boolean = false;
  toast: any;
  toastMessage:any;
  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public gameProvider:GameProvider, private media: Media, public loadingCtrl: LoadingController, private socket: Socket, public toastCtrl: ToastController) {
    this.messageFrom = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
    this.cells = document.querySelectorAll('.cell');
    //console.log(this.cells);
    this.presentLoading("Please wait ..", 0)
    this.startGame();
    
  }

  reStartGame(){
    this.playerTrue = false;
    this.tie = true;
    this.tableRow = [];
    this.tableCell = [];

    this.socket.emit('restartGameByUser', {playerName: this.gameProvider.huUsername}, function (message, gameId) {
      //alert('waiting for user');;
    });

    setTimeout(() => {
      this. startGame();
      this.playerTrue = !this.playerTrue;
    }, 1000);
    
  }

  ionViewWillLeave(){
   //this.file.release();
    //this.fileTic.release();
    this.gameProvider.huPlayer = undefined;
    this.gameProvider.aiPlayer = undefined;
    if(!this.alreadyDisconnected){
      this.socket.emit("forceDisconnect", function(err){

      });
    }
    //this.socket.ioSocket.disconnect();
    //this.socket.removeAllListeners();
  }

ionViewWillEnter()
{
 
  console.log('view enter');
  //this.socket.on('connect', function () {
  //});
  this.socket.connect();
  this.socket.emit('join', {playerName: this.gameProvider.huUsername}, function (message, gameId) {
    //alert('waiting for user');;
  });


  this.getWaitingForOpponent().subscribe(message =>  {
    console.log(message);
    this.hideLoading();
    this.presentLoading("Waiting for your opponents...", 0);
    this.gameProvider.huPlayer = 'O';
    //this.socketData = message;
    //this.playerPosition = this.socketData.position;
     
  });
  this.teamCompleted().subscribe(message =>  {
    console.log(message);
    this.hideLoading();
    this.socketData = message;
    for(var user of this.socketData.users){
      if(user != this.gameProvider.huUsername){
        this.gameProvider.aiUsername = user; 
      }
    }
    if(this.gameProvider.huPlayer == undefined){
      this.gameProvider.huPlayer = 'X'
      this.gameProvider.aiPlayer = 'O'
     
      this.userTurnToast(this.gameProvider.aiUsername + " turn");
    }
    else if (this.gameProvider.huPlayer == 'O'){
      this.gameProvider.aiPlayer = 'X'
      this.userTurnToast("You Turn")
      this.valid = true;
    }
    debugger;
    
    //this.socketData = message;
    //this.playerPosition = this.socketData.position;
    
  });   

  this.opponentMove().subscribe(message =>  {
    console.log(message);
    this.userTurnToast("Your Turn")
    debugger;
    this.valid = true;
    this.socketData = message;
    this.turnClickOpponent(this.socketData.position);
   
     
  });   

  this.restartGameByServer().subscribe(message =>  {
    console.log(message);
   
    this.tie = true;
    this.tableRow = [];
    this.tableCell = [];
    setTimeout(() => {
      this.startGame();
      this.playerTrue = !this.playerTrue;
    }, 1000);
  });   


  this.broadcastUserMessage().subscribe(message =>  {
    console.log(message);
    this.socketData = message;
    this.userMessage(this.socketData.message);
    
  });   


  this.oppDisconnect().subscribe(message =>  {
    //this.oppDisconnect().un.unsubscribe();
    this.alreadyDisconnected = true;
    //this.navCtrl.pop();
    this.presentLoading("You opponent discounnect ..", 3000)
    this.socket.emit('forceDisconnect', function (err) {
      
      });   
    setTimeout(() => {
      
       try{
        this.toast.dismiss();
        //this.toastMessage.dismiss();
        this.navCtrl.pop();
       }
       catch(e) {

       }
    }, 3000);
    
  });   
}


presentLoading(message, duration) {
  this.loader = this.loadingCtrl.create({
    content: message,
    duration: duration
  });
  this.loader.present();
}
hideLoading() {
  try{
  this.loader.dismiss();
  }
  catch(e){

  }
}

  play(filename){
    try{
      
      this.file.release();
    }
    catch(e){

    } 
      this.file = this.media.create('/android_asset/www/assets/mp3/'+filename);
      this.file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
      this.file.onSuccess.subscribe(() => { console.log('Action is successful'); 
      setTimeout(() => {
        this.file.release();
      }, 3000);
    }
        );
      this.file.onError.subscribe(error => { 
        
        console.log('Error!', error); 
        this.file.stop();
        this.file.release()} 

    );
      this.file.play();
     
  }
  playTic(filename){
    try{
      
      this.file.release();
    }
    catch(e){

    } 
      this.fileTic = this.media.create('/android_asset/www/assets/mp3/'+filename);
      this.fileTic.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
      this.fileTic.onSuccess.subscribe(() => { console.log('Action is successful');
      setTimeout(() => {
        this.fileTic.release();
      }, 3000);
    });
      this.fileTic.onError.subscribe(error => { 
        
        console.log('Error!', error); 
        this.fileTic.stop()
        this.fileTic.release()} 

    );
      this.fileTic.play();
     
  }


startGame(){
    this.tie = true;
    this.tableRow.push(0);
    this.tableRow.push(1);
    this.tableRow.push(2);

    this.tableCell.push(0);
    this.tableCell.push(1);
    this.tableCell.push(2); 
   
   // document.querySelector(".endgame").style.display = "none";
   this.result = false;
   this.loading = false 
   this.gameOverDiv = "hidden";
    this.gameProvider.origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].innerText = '';
      this.cells[i].style.removeProperty('background-color');
      //this.cells[i].addEventListener('click', this.turnClick, false);
    }        
}

turnClick(id, element){
  if(this.valid){
    if(!this.result && !this.loading){
      //this.playTic("tap.mp3")
      if (typeof this.gameProvider.origBoard[id] == 'number') {
        if (!this.checkWin(this.gameProvider.origBoard, this.gameProvider.huPlayer)) {
          this.valid = false;
          this.userTurnToast(this.gameProvider.aiUsername + " turn")
          this.socket.emit('playermove', {playerName: this.gameProvider.huUsername, itemId: id}, function (message, gameId) {
            //alert('waiting for user');;
          });       
              this.turn(id, this.gameProvider.huPlayer,element )

            if  (this.emptySquares().length == 0){
              this.checkTie();
            }
           
        }
      }
    }
  }
  else{
   
  }
}

turnClickOpponent(id){
  if(!this.result && !this.loading){
    //this.playTic("tap.mp3")
    if (typeof this.gameProvider.origBoard[id] == 'number') {
      if (!this.checkWin(this.gameProvider.origBoard, this.gameProvider.huPlayer)) {
        this.valid = true;
          this.turnOpponent(id, this.gameProvider.aiPlayer );
        if  (this.emptySquares().length == 0){
            this.checkTie();
          }
      }
    }
  }
}

turn(squareId, player, element) {
  try{
    this.gameProvider.origBoard[squareId] = player;
    //element.innerText = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = this.checkWin(this.gameProvider.origBoard, player)
    if (gameWon) this.gameOver(gameWon)
  }
  catch(e){

  }
}

turnOpponent(squareId, player) {
  try{
    this.gameProvider.origBoard[squareId] = player;
    //element.innerText = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = this.checkWin(this.gameProvider.origBoard, player)
    if (gameWon) this.gameOver(gameWon)
  }
  catch(e){

  }
}

checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
      (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
  for (let  winIndex in this.gameProvider.winCombos) {
   // console.log(win);
   let win = this.gameProvider.winCombos[winIndex];
  // console.log((win.every(elem => plays.indexOf(elem) )))
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        this.playWin = plays;
      
        gameWon = {index: winIndex, player: player};
        break;
      }
    }
    return gameWon;
}

gameOver(gameWon) {
    for (let index of this.gameProvider.winCombos[gameWon.index]) {
      let i: number = index;
      console.log(index);
      document.getElementById(index+"").style.backgroundColor =
        gameWon.player == this.gameProvider.huPlayer ? "blue" : "blue";

    }
    this.tie = false;
    this.gameOverDiv = "shown";
    this.declareWinner(gameWon.player == this.gameProvider.huPlayer ? "You win!" : "You lose.");
  }

declareWinner(who) {
  
     if(who == "You win!"){
        who = this.gameProvider.huUsername +" Win";
        this.playerOneScore = this.playerOneScore + 1;
        this.playerTwoLossScore = this.playerTwoLossScore + 1;
        this.tie = false;
        this.userTurnToast(this.gameProvider.huUsername +" Win");

     }
     else if(who == "You lose."){
        who = this.gameProvider.aiUsername + " Win";
        this.playerTwoScore = this.playerTwoScore + 1;
        this.playerOnelossScore = this.playerOnelossScore + 1;
        this.tie = false;
        this.userTurnToast(this.gameProvider.aiUsername +" Win");
     }
     
    //this.play("win.mp3")
     this.winner = who
     this.result = true;
    
  }

  emptySquares() {
    return this.gameProvider.origBoard.filter(s => typeof s == 'number');
  }
  
checkTie() {
    if (this.emptySquares().length == 0) {
      for (var i = 0; i < 9; i++) {
        document.getElementById(i+"").style.backgroundColor = "green";
        
        this.tie = true;
      }
    this.declareWinner("Tie Game!")
    //this.play("loss.mp3")
    this.tieCount = this.tieCount + 1; 
    this.gameOverDiv = "shown";
      return true;
    }
    return false;

  }

listAnimationDone(event){
  console.log(event.toState);
  

  //
}

getWaitingForOpponent() {
  let observable = new Observable(observer => {
    this.socket.on('waitingForOpponent', (data) =>{
      observer.next(data);
    });
  })
  return observable;
}

teamCompleted() {
  let observable = new Observable(observer => {
    this.socket.on('teamCompleted', (message) =>  {
      debugger;
      observer.next(message);
    });
  })
  return observable;
}


opponentMove() {
  let observable = new Observable(observer => {
    this.socket.on('opponentMove', (message) =>  {
      debugger;
      observer.next(message);
    });
  })
  return observable;
}

restartGameByServer() {
  let observable = new Observable(observer => {
    this.socket.on('opponentRestartGame', (message) =>  {
      debugger;
      observer.next(message);
    });
  })
  return observable;
}


broadcastUserMessage() {
  let observable = new Observable(observer => {
    this.socket.on('broadcastUserMessage', (message) =>  {
      debugger;
      observer.next(message);
    });
  })
  return observable;
}


userTurnToast(message) {
  this.toast = this.toastCtrl.create({
    message: message,
    position: 'bottom'
  });
  this.toast.present();
}

userMessage(message) {
  this.toastMessage = this.toastCtrl.create({
    message: message,
    position: 'top',
    duration: 3000
  });
  this.toastMessage.present();
}

sendMessage(){
  console.log(this.messageFrom.controls.message.value);
 this.socket.emit('sendMessage', {message: this.messageFrom.controls.message.value}, function (message, gameId) {
  
    //alert('waiting for user');;
 });   
 this.messageFrom.controls.message.setValue('');    
}


oppDisconnect(){
  let observable = new Observable(observer => {
    this.socket.on('oppDisconnect', (message) =>  {
      debugger;
      observer.next(message);
      observer.unsubscribe();
      
    });
  })
  return observable;

   
}


}
