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
        this.onUpdateUserName(text.toString());
      }
    });
  }

  ngOnInit() {
    this.authService.authState.subscribe(user => {
      this.user = user;
      const a = this.aLocalStorageService.getUser();
      if (a !== undefined && a != null && a.trim().length > 1) {
        this.onUpdateUserName(a);
      }
    });
  }

  public onUpdateUserName(loginUserName: string) {
    this.isValidLogin = true;
    this.loginUserName = loginUserName;
    const pic = this.aLocalStorageService.getSocialLogin();
    if (pic != null) {
        this.profilePic = pic['photoUrl'];
    }
  }

  public logout() {
    this.isValidLogin = false;
    this.profilePic = null;
    this.loginUserName = 'Login';
    this.aLocalStorageService.emitChange(null);
    this.aLocalStorageService.clearLogin();
    this.authService.signOut().then( result => {
      this.router.navigate(['/login/']);
    })
    .catch( error =>  {
      console.log(error);
      this.router.navigate(['/login/']);
    });
  }
}
