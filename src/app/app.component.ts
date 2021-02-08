import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
const  { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    public auth: AuthService,
    private router: Router,
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
}
