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

import { Contact, Phone, Email, Address, Website } from '../contact.model';
import { ContactService } from '../../../service/contact.service';
import { MyErrorStateMatcher } from '../../../util/myerror-state-matcher';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  countryArr: any = [];
  stateArr: any = [];
  cityArr: any = [];
  filterCountry = '';
  filterState = '';
  filterCity = '';
  isCountryLoading = true;
  isStateLoading = false;
  isCityLoading = false;

  aForm: FormGroup;
  contactrows: FormArray;
  emailrows: FormArray;
  websiterows: FormArray;
  addressrows: FormArray;

  aObj: any;
  matcher = new MyErrorStateMatcher();
  isSaved = false;

  titleList = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'];
  phoneTypeList = ['Mobile', 'Home', 'Work', 'Fax', 'Office', 'Others'];
  emailTypeList = ['Work', 'Personal', 'Office', 'Others'];
  addressTypeList = ['Home', 'Work', 'Permant', 'Current', 'Others'];
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
    this.emailrows = this.formBuilder.array([]);
    this.aForm.addControl('emailrows', this.emailrows);
    this.websiterows = this.formBuilder.array([]);
    this.aForm.addControl('websiterows', this.websiterows);
    this.addressrows = this.formBuilder.array([]);
    this.aForm.addControl('addressrows', this.addressrows);
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

  onAddAddressRow() {
    this.addressrows.push(
      this.formBuilder.group({
        type: '',
        primary: false,
        addline1: '',
        addline2: '',
        landmark: '',
        area: '',
        city: '',
        dist: '',
        state: '',
        country: '',
        pin: ''
      })
    );
  }

  onRemoveAddressRow(rowIndex: number) {
    this.addressrows.removeAt(rowIndex);
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
    } else {
      this.contactrows.push(
        this.formBuilder.group({
          type: this.phoneTypeList[0],
          no: '',
          primary: true
        })
      );
      this.emailrows.push(
        this.formBuilder.group({
          type: this.emailTypeList[0],
          email: '',
          primary: true
        })
      );
    }
    this.getCountry();
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
    this.aObj.contactrows.forEach((obj: Phone) => {
      this.contactrows.push(
        this.formBuilder.group({
          type: obj.type,
          no: obj.no,
          primary: obj.primary
        })
      );
    });
    this.aObj.emailrows.forEach((obj: Email) => {
      this.emailrows.push(
        this.formBuilder.group({
          type: obj.type,
          email: obj.email,
          primary: obj.primary
        })
      );
    });
    this.aObj.websiterows.forEach((obj: Website) => {
      this.websiterows.push(
        this.formBuilder.group({
          type: obj.type,
          website: obj.website,
          primary: obj.primary
        })
      );
    });
    this.aObj.addressrows.forEach((obj: Address) => {
      this.addressrows.push(
        this.formBuilder.group({
          type: obj.type,
          primary: obj.primary,
          addline1: obj.addline1,
          addline2: obj.addline2,
          landmark: obj.landmark,
          area: obj.area,
          city: obj.city,
          dist: obj.dist,
          state: obj.state,
          country: obj.country,
          pin: obj.pin
        })
      );
    });

    this.aForm.patchValue({
      //setValue
      title: this.aObj.title,
      fname: this.aObj.fname,
      lname: this.aObj.lname !== null ? this.aObj.lname : '',
      nickname: this.aObj.nickname !== null ? this.aObj.nickname : '',
      description: this.aObj.description !== null ? this.aObj.description : '',
      company: this.aObj.company !== null ? this.aObj.company : '',
      image: this.aObj.image
      // contactrows: this.contactrows,
      // emailrows: this.emailrows,
      // websiterows: this.websiterows,
      // addressrows: this.addressrows,
    });
  }

  list() {
    this.directrouter.navigate(['/contact']);
  }

  new() {
    this.aForm.reset();
    this.aForm.removeControl('contactrows');
    this.contactrows = this.formBuilder.array([]);
    this.aForm.addControl('contactrows', this.contactrows);
    this.aForm.removeControl('emailrows');
    this.emailrows = this.formBuilder.array([]);
    this.aForm.addControl('emailrows', this.emailrows);
    this.aForm.removeControl('websiterows');
    this.websiterows = this.formBuilder.array([]);
    this.aForm.addControl('websiterows', this.websiterows);
    this.aForm.removeControl('addressrows');
    this.addressrows = this.formBuilder.array([]);
    this.aForm.addControl('addressrows', this.addressrows);
    this.contactrows.push(
      this.formBuilder.group({
        type: this.phoneTypeList[0],
        no: '',
        primary: true
      })
    );
    this.emailrows.push(
      this.formBuilder.group({
        type: this.emailTypeList[0],
        email: '',
        primary: true
      })
    );
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

  onFormSubmit(form: NgForm) {
    // console.log(form);
    if (this.isSaved) {
      this.aService.updateData(this.aObj._id, form).subscribe(
        res => {
          this.directrouter.navigate(['/contact/', this.aObj._id]);
        },
        err => {
          console.error(JSON.stringify(err));
          alert('Something Went wrong!');
        }
      );
    } else {
      this.aService.createData(form).subscribe(
        res => {
          // console.log(res);
          this.isSaved = false;
          // this.directrouter.navigate(['/contact/', res.insertedIds[0]]);
          const cID = res['insertedIds'][0];
          this.directrouter.navigate(['/contact/', cID]);
        },
        err => {
          if (err.status === 500) {
            alert('Duplicate Data Entry, Please provide new again');
          } else {
            console.error(JSON.stringify(err));
            alert('Something Went wrong!');
          }
        }
      );
    }
  }

  getCountry() {
    this.countryArr = [];
    this.isCountryLoading = true;
    this.aService.getCountry().subscribe((data: Object) => {
      this.isCountryLoading = false;
      // console.log(data);
      this.countryArr = data;
    });
  }

  getState(event) {
    let id;
    for (let m = 0; m < this.countryArr.length; m++) {
      if (event === this.countryArr[m].name) {
        id = this.countryArr[m].id;
        break;
      }
    }

    this.stateArr = [];
    this.cityArr = [];
    this.isStateLoading = true;
    this.aService.getState(parseInt(id)).subscribe((data: Object) => {
      this.isStateLoading = false;
      this.stateArr = data;
    });
  }

  getCity(event) {
    let id;
    for (let m = 0; m < this.stateArr.length; m++) {
      if (event === this.stateArr[m].name) {
        id = this.stateArr[m].id;
        break;
      }
    }

    this.cityArr = [];
    this.filterCity = '';
    this.isCityLoading = true;
    this.aService.getCity(parseInt(id)).subscribe((data: Object) => {
      this.isCityLoading = false;
      this.cityArr = data;
    });
  }
}
