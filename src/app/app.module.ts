import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Media, MediaObject } from '@ionic-native/media';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GameProvider } from '../providers/game/game';
import { GamelogicProvider } from '../providers/gamelogic/gamelogic';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
//const config: SocketIoConfig = { url: 'http://localhost:3000', options: {'forceNew':true } };
const config: SocketIoConfig = { url: 'http://vast-peak-65625.herokuapp.com/', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    Media,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GameProvider,
    GamelogicProvider
  ]
})
export class AppModule {}
