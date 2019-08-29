import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  public loginUserName: string = 'User';
  public isValidLogin: boolean = false;

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  constructor(
    private router: Router,
    private aLocalStorageService: LocalStorageService
  ) {
    aLocalStorageService.changeEmitted$.subscribe(
      text => {
        if (text != null) {
          this.isValidLogin = true;
          this.loginUserName = text.toString();
        }
      });
  }

  ngOnInit() {
    let a = this.aLocalStorageService.getUser();
    if (a != undefined && a != null && a.trim().length > 1) {
      this.isValidLogin = true;
      this.loginUserName = a;
    }
  }

  public onUpdateUserName(loginUserName: string) {
    this.isValidLogin = true;
    this.loginUserName = loginUserName;
  }

  public logout() {
    this.isValidLogin = false;
    this.aLocalStorageService.clearLogin();
    this.router.navigate(['/login/']);
  }
}
