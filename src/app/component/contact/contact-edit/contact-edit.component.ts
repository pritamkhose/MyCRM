import { Website } from './../contact.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  FormArray,
  NgForm,
  Validators
} from '@angular/forms';

import { Contact } from '../contact.model';
import { ContactService } from '../../../service/contact.service';
import { MyErrorStateMatcher } from '../../../util/myerror-state-matcher';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  aForm: FormGroup;
  contactrows: FormArray;
  emailrows: FormArray;
  websiterows: FormArray;
  adddressrows: FormArray;

  aObj: any;
  matcher = new MyErrorStateMatcher();
  isSaved = false;

  titleList = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
  phoneTypeList = ['Mobile', 'Home', 'Work', 'Fax', 'Office', 'Others'];
  emailTypeList = ['Work', 'Personal', 'Office', 'Others'];
  websiteTypeList = [
    'Self',
    'Facebook',
    'Linkedin',
    'Twitter',
    'Wiki',
    'Others'
  ];

  constructor(
    private directrouter: Router,
    private router: ActivatedRoute,
    private aService: ContactService,
    private formBuilder: FormBuilder
  ) {
    this.aForm = this.formBuilder.group({
      title: [null, Validators.required],
      fname: [null, Validators.required],
      lname: [null],
      nickname: [null],
      description: [null],
      company: [null],
      image: [null, Validators.required]
    });

    this.contactrows = this.formBuilder.array([]);
    this.aForm.addControl('contactrows', this.contactrows);
    this.contactrows.push(
      this.formBuilder.group({
        type: this.phoneTypeList[0],
        no: '',
        primary: true
      })
    );
    this.emailrows = this.formBuilder.array([]);
    this.aForm.addControl('emailrows', this.emailrows);
    this.emailrows.push(
      this.formBuilder.group({
        type: this.emailTypeList[0],
        email: '',
        primary: true
      })
    );
    this.websiterows = this.formBuilder.array([]);
    this.aForm.addControl('websiterows', this.websiterows);
    this.websiterows.push(
      this.formBuilder.group({
        type: this.websiteTypeList[0],
        website: '',
        primary: true
      })
    );
    this.adddressrows = this.formBuilder.array([]);
    this.aForm.addControl('adddressrows', this.adddressrows);
  }

  onAddPhoneRow() {
    this.contactrows.push(
      this.formBuilder.group({
        type: '',
        no: '',
        primary: false
      })
    );
  }

  onRemovePhoneRow(rowIndex: number) {
    this.contactrows.removeAt(rowIndex);
  }

  onAddEmailRow() {
    this.emailrows.push(
      this.formBuilder.group({
        type: '',
        email: '',
        primary: false
      })
    );
  }

  onRemoveEmailRow(rowIndex: number) {
    this.emailrows.removeAt(rowIndex);
  }

  onAddWebsiteRow() {
    this.websiterows.push(
      this.formBuilder.group({
        type: '',
        website: '',
        primary: false
      })
    );
  }

  onRemoveWebsiteRow(rowIndex: number) {
    this.websiterows.removeAt(rowIndex);
  }

  ngOnInit() {
    if (this.router.snapshot.url[1].path.length > 2) {
      this.isSaved = true;
      if (this.aService.aSendObj != null) {
        this.aObj = this.aService.aSendObj;
        this.setData();
      } else {
        this.getData(this.router.snapshot.url[1].path);
      }
    }
  }

  getData(id: string) {
    this.aService.getDataByID(id).subscribe(
      data => {
        this.aObj = data[0];
        this.setData();
      },
      err => {
        alert('Invalid Data Found!');
        this.directrouter.navigate(['/contact']);
      }
    );
  }

  setData() {
    this.aForm.setValue({
      description: this.aObj.description,
      image: this.aObj.image
    });
  }

  list() {
    this.directrouter.navigate(['/contact']);
  }

  new() {
    this.aForm.reset();
    this.directrouter.navigate(['/contact/0']);
  }

  delete() {
    this.directrouter.navigate(['/contact']);
    this.aService.deleteData(this.aObj._id).subscribe(
      res => {
        // console.log('Deleted Suceefully --> ' + JSON.stringify(res));
        this.list();
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
        this.directrouter.navigate(['/contact/', this.aObj._id]);
      }
    );
  }

  test() {
    console.log(this.aForm);
  }

  onFormSubmit(form: NgForm) {
    console.log(form);
    // if (this.isSaved) {
    //   this.aService
    //     .updateData(this.aObj._id, form)
    //     .subscribe(
    //       res => {
    //         this.directrouter.navigate(['/contact/', this.aObj._id]);
    //       },
    //       err => {
    //         console.error(JSON.stringify(err));
    //         alert('Something Went wrong!');
    //       }
    //     );
    // } else {
    //   this.aService.createData(form).subscribe(
    //     res => {
    //       // console.log(res);
    //       this.isSaved = false;
    //       // this.directrouter.navigate(['/contact/', res.insertedIds[0]]);
    //       const cID = res['insertedIds'][0];
    //       this.directrouter.navigate(['/contact/', cID]);
    //     },
    //     err => {
    //       if (err.status === 500) {
    //         alert('Duplicate Data Entry, Please provide new again');
    //       } else {
    //         console.error(JSON.stringify(err));
    //         alert('Something Went wrong!');
    //       }
    //     }
    //   );
    // }
  }
}
