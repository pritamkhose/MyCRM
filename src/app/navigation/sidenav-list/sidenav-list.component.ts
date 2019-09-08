import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, SocialUser } from 'angularx-social-login';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  public loginUserName: string = 'Login';
  public isValidLogin: boolean = false;
  public profilePic: string = null;
  user: SocialUser;

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  constructor(
    private router: Router,
    private aLocalStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    aLocalStorageService.changeEmitted$.subscribe(text => {
      if (text != null) {
        this.isValidLogin = true;
        this.loginUserName = text.toString();
      }
    });
  }

  ngOnInit() {
    this.authService.authState.subscribe(user => {
      this.user = user;
      let pic = this.aLocalStorageService.getSocialLogin();
      if (pic != null) {
        this.profilePic = pic['photoUrl'];
      }
    });
    let a = this.aLocalStorageService.getUser();
    if (a != undefined && a != null && a.trim().length > 1) {
      this.isValidLogin = true;
      this.loginUserName = a;
      let pic = this.aLocalStorageService.getSocialLogin();
      if (pic != null) {
        this.profilePic = pic['photoUrl'];
      }
    }
  }

  public onUpdateUserName(loginUserName: string) {
    this.isValidLogin = true;
    this.loginUserName = loginUserName;
    let pic = this.aLocalStorageService.getSocialLogin();
    if (pic != null) {
        this.profilePic = pic['photoUrl'];
    }
  }

  public logout() {
    // console.log(this.user);
    this.isValidLogin = false;
    this.profilePic = null;
    this.loginUserName = 'Login';
    this.aLocalStorageService.emitChange(null);
    this.authService.signOut().then( result => {
      this.aLocalStorageService.clearLogin();
      this.router.navigate(['/login/']);
    })
    .catch( error =>  {
      this.aLocalStorageService.clearLogin();
      console.log(error);
      this.router.navigate(['/login/']);
    });
  }
}
