import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  ValidationErrors
} from '@angular/forms';

import { MyErrorStateMatcher } from '../../util/myerror-state-matcher';

import { LoginService } from '../../service/login.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class SignupComponent implements OnInit {

  aForm: FormGroup;
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
    this.aForm = this.formBuilder.group({
      email: [null, Validators.required],
      username: [null,  Validators.required],
      password: [null, Validators.required],
      repeatpassword: [null, Validators.required],
    }
    ,{ validator: this.MatchConfirom('password', 'repeatpassword')}
    );
  }

  // https://stackoverflow.com/questions/48397251/how-to-check-if-2-fields-are-equal-in-angular-4
  private MatchConfirom(type1: any, type2: any) {

    return (checkForm: FormGroup) => {
      let value1 = checkForm.controls[type1];
      let value2 = checkForm.controls[type2];

      if (value1.value === value2.value) {
        return value2.setErrors(null);
      } else {
        return value2.setErrors({ notEquivalent: true });
      }
    };
  }

  onFormSubmit(form: NgForm) {
    // console.log(form);
    this.aService
      .setRegister(form)
      .subscribe(
        (data: any) => {
          if (data.user != null) {
            this.aLocalStorageService.setLogin(data.user.username, data.user.email, data.user.token);
            this.router.navigate(['/home/']);
          } else {
            this.message = data.error;
          }
        },
        err => {
          console.error(JSON.stringify(err));
          alert('Something Went wrong!');
        }
      );
  }

}
