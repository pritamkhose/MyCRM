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
  selector: 'app-passwordforgot',
  templateUrl: './passwordforgot.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class PasswordforgotComponent implements OnInit {

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
      email: [null],
      username: [null],
    }, { validator: this.atLeastOne('email', 'username') }
    );


    var a = this.aLocalStorageService.getUser();
    if (a != null && a.trim().length > 1) {
      this.aForm.controls['username'].setValue(a);
    }
    var a = this.aLocalStorageService.getEmail();
    if (a != null && a.trim().length > 1) {
      this.aForm.controls['email'].setValue(a);
    }

  }

  // https://stackoverflow.com/questions/41020069/require-one-from-two-fields-using-angular-2
  atLeastOne(...fields: string[]) {

    const isFieldEmpty = (fieldName: string, fg: FormGroup) => {
      const field = fg.get(fieldName).value;
      if (typeof field === 'number') { return field && field >= 0 ? true : false; }
      if (typeof field === 'string') { return field && field.length > 0 ? true : false; }
    };

    return (fg: FormGroup): ValidationErrors | null => {
      return fields.some(fieldName => isFieldEmpty(fieldName, fg))
        ? null
        : ({ atLeastOne: 'At least one field has to be provided.' } as ValidationErrors);
    };

  }

  onFormSubmit(form: NgForm) {
    this.aService
      .setForgotPassword(form)
      .subscribe(
        (data: any) => {
          console.log(JSON.stringify(data));
          if (data.error != null) {
            this.message = data.error;
          } else {
              //console.log(form['username'] + form['email'])
              this.aLocalStorageService.setUser(form['username']);
              this.aLocalStorageService.setEmail(form['email']);
              this.router.navigate(['/passwordresetcode/']);
          }
        },
        err => {
          console.error(JSON.stringify(err));
          alert('Something Went wrong!');
        }
      );
  }
}
