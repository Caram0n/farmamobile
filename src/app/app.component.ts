import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
const  { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  version;

  constructor(
    public auth: AuthService,
    private router: Router,
    public alertCtrl: AlertController,
    ) {
    this.initializeApp();    
  }
  

  initializeApp() {
    SplashScreen.hide().catch(error => {
      console.error(error);
    });
    StatusBar.hide().catch(error => {
      console.error(error);
    });
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async info(){
    const alert = await this.alertCtrl.create({
      cssClass: 'alertCustom',
      header: 'Versión 0.0.1',
      subHeader: 'David Díaz',
      message: 'https://github.com/Caram0n/farmamobile' ,
      buttons: ['OK']
    });

    await alert.present();

  }
}
