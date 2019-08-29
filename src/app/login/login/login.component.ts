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
  matcher = new MyErrorStateMatcher();


  constructor(
    private router: Router,
    private aService: LoginService,
    private aLocalStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.boardsForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  onFormSubmit(form: NgForm) {
      this.aService
        .setLogin(form)
        .subscribe(
          (data : any) => {
            // console.log(JSON.stringify(data));
            if(data.error != null){
              this.message = data.error;
              this.aLocalStorageService.clearLogin();
            } else {
              this.aLocalStorageService.emitChange(data.username);
              this.aLocalStorageService.setLogin(data.username, data.email, data.token);
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
