import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginAuthService } from './login-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Project-Management';
  public currentstatus: any;

  constructor(private translate: TranslateService){
    translate.addLangs(['en-US', 'id-ID']);
    translate.setDefaultLang('id-ID');
    // this.currentstatus = this.authService.getStatus().subscribe(currentstatus => {
    //   this.currentstatus = currentstatus;
    // })
  }

  
}
