import { Component, trigger, state, style, transition, animate, keyframes, group } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GameProvider } from '../../providers/game/game';
import { Media, MediaObject } from '@ionic-native/media';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  
})
export class HomePage {
  gameOption;// = 'hidden';
  selectedPlayer: number = 0;
  selectType: number = 0;
  isPlay: boolean = false;
  file: MediaObject;
  constructor( public navCtrl: NavController, public navParams: NavParams, public gameProvider:GameProvider, private media: Media) {
  }

  ionViewDidLoad() {
    
  }
  
  ionViewWillEnter(){

  }



  play(filename){
    try{
     
      //this.file.release();
    }
    catch(e){

    } 
      this.file = this.media.create('/android_asset/www/assets/mp3/'+filename);
      this.file.onStatusUpdate.subscribe(status => {
        
      }); 
      // fires when file status changes
      this.file.onSuccess.subscribe(() => { console.log('Action is successful');  setTimeout(() => {
        this.file.release();
      }, 1000);}
        );
      this.file.onError.subscribe(error => { console.log('Error!', error); this.file.stop(); this.file.release()} );
      this.file.play();
   
    }
    
    ionViewWillLeave(){
      //this.file.release();
    }
  

  playType(type){
    this.gameProvider.type = "double";      
  }


  startGame(){
    this.navCtrl.push('GamePage');  
  }
}
