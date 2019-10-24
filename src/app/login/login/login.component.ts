import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';

// https://stackblitz.com/edit/angularx-social-login
// https://www.9lessons.info/2018/07/social-login-using-angular-and-restful.html
// https://www.npmjs.com/package/angularx-social-login

// https://console.developers.google.com/apis/credentials?project=angular-db-fa163
// client ID= 260588641171-3c0akgkm8j9ubqm6bn3vrqvqq5ou7re5.apps.googleusercontent.com
// client Secert = ImW-r9lqXv4FWepHwvnGysAr
// https://developers.facebook.com/apps/489434948455038/settings/basic/
// https://developers.facebook.com/apps/489434948455038/fb-login/settings/
// App ID= 489434948455038
// https://stackoverflow.com/questions/37001004/facebook-login-message-url-blocked-this-redirect-failed-because-the-redirect

// Login Validate Token for JWT
// https://www.sitepoint.com/spa-social-login-google-facebook/
// https://ole.michelsen.dk/blog/social-signin-spa-jwt-server.html

// https://github.com/omichelsen/blog-social-signin-spa-jwt-server/blob/master/api/index.js
// https://graph.facebook.com/me?access_token=authToken

// https://stackoverflow.com/questions/359472/how-can-i-verify-a-google-authentication-api-access-token
// https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=authToken


import { AuthService, SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider
} from 'angularx-social-login';

import { MyErrorStateMatcher } from '../../util/myerror-state-matcher';

import { LoginService } from '../../service/login.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  boardsForm: FormGroup;
  _id = '';
  email = '';
  password = '';
  message = '';
  aObj: any;
  acount = 0;
  matcher = new MyErrorStateMatcher();

  user: SocialUser;

  constructor(
    private router: Router,
    private aService: LoginService,
    private aLocalStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.boardsForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.authService.authState.subscribe(user => {
      this.user = user;
      if (user != null) {
        this.setUser(user);
      }
    });
  }

  setUser(user): void {
    // console.log(user);
    this.aLocalStorageService.setSocialLogin(user);
    this.aLocalStorageService.emitChange(user.name);
    this.aLocalStorageService.setLogin(user.name, user.email, user.authToken);
    const aObj = {
      username: user.name,
      email: user.email,
      password: user.authToken,
      resetcode: 0,
      resetTime : null,
      isActive : true,
      isSocial : true,
      info: user
    };
    if (this.acount === 0) {
      this.acount = this.acount + 1;
      this.aService
      .setRegisterSocialsign(aObj)
      .subscribe(
        (data: any) => {
          if (data != null) {
            if (data.user.token != null) {
              this.aLocalStorageService.setToken(data.user.token);
            }
            this.router.navigate(['/home/']);
          } else {
            console.error(data);
            this.message = data;
          }

        },
        err => {
          console.error(JSON.stringify(err));
          alert('Something Went wrong!');
        }
      );
    }


  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      x => {
        this.setUser(x);
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
      }
    );
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      x => {
        this.setUser(x);
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
      }
    );
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID).then(
      x => {
        this.setUser(x);
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
      }
    );
  }

  signOut(): void {
    this.authService.signOut();
  }

  onFormSubmit(form: NgForm) {
    this.aService.setLogin(form).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.error != null) {
          this.message = data.error;
          this.aLocalStorageService.clearLogin();
        } else {
          this.aLocalStorageService.emitChange(data.username);
          this.aLocalStorageService.setLogin(
            data.username,
            data.email,
            data.token
          );
          this.router.navigate(['/home/']);
        }
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
      }
    );
  }
}
