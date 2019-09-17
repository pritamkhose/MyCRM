import { Component, OnInit } from '@angular/core';
// https://stackblitz.com/angular/moyomqpeprev?file=app%2Fcdk-drag-drop-sorting-example.ts
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// https://material.io/resources/icons/?style=baseline
import { ConfigService } from './../../service/config.service';
import { AlertService } from './../../service/alert.service';

import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  FormArray,
  NgForm,
  Validators
} from '@angular/forms';

import { MyErrorStateMatcher } from './../../util/myerror-state-matcher';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  aForm: FormGroup;
  titlerows: FormArray;
  contactrows: FormArray;
  emailrows: FormArray;
  websiterows: FormArray;
  addressrows: FormArray;


  aObj: any;
  matcher = new MyErrorStateMatcher();

  constructor(
    private aService: ConfigService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) {
    this.initform();
    this.aObj = {
      titlerows: ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Sir', 'Madam'],
      contactrows: ['Mobile', 'Home', 'Work', 'Fax', 'Office', 'Others'],
      emailrows: ['Work', 'Personal', 'Office', 'Others'],
      addressrows: ['Home', 'Work', 'Permant', 'Current', 'Others'],
      websiterows: [
        'Self',
        'Facebook',
        'Linkedin',
        'Twitter',
        'Wiki',
        'Others'
      ]
    };
  }

  ngOnInit() {
    // this.aService.getData().subscribe(
    //   data => {
    //     this.aObj = data[0];
        this.setData();
    //   },
    //   err => {
    //     console.log(err);
    //     this.alertService.toastrSuccess('Something Went wrong! Not able Fetch Data.');
    //   }
    // );
  }

  refresh() {
    this.reset();
    this.ngOnInit();
  }

  reset() {
    this.aForm.reset();
    this.initform();
  }

  initform() {
    this.aForm = this.formBuilder.group({});
    this.titlerows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('titlerows', this.titlerows);
    this.contactrows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('contactrows', this.contactrows);
    this.emailrows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('emailrows', this.emailrows);
    this.websiterows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('websiterows', this.websiterows);
    this.addressrows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('addressrows', this.addressrows);
  }

  setData() {
    // console.log(this.aObj);
    this.setForm(this.aObj.titlerows, this.titlerows);
    this.setForm(this.aObj.contactrows, this.contactrows);
    this.setForm(this.aObj.emailrows, this.emailrows);
    this.setForm(this.aObj.websiterows, this.websiterows);
    this.setForm(this.aObj.addressrows, this.addressrows);
  }

  setForm(inobj, inForm) {
    inobj.forEach((obj) => {
      inForm.push(
        this.formBuilder.group({
          type: obj,
        }));
    });
  }

  onFormSubmit(bform: NgForm) {
    var inform = {
      titlerows: this.getObjArray(bform['titlerows']),
      contactrows: this.getObjArray(bform['contactrows']),
      emailrows: this.getObjArray(bform['emailrows']),
      websiterows: this.getObjArray(bform['websiterows']),
      addressrows: this.getObjArray(bform['addressrows']),
    };
    // this.aService.createData(inform).subscribe(
    this.aService.updateData(inform).subscribe(
      data => {
        // console.log(data);
        this.alertService.toastrSuccess('Saved Successfully !');
      },
      err => {
        console.error(JSON.stringify(err));
        this.alertService.toastrSuccess('Something Went wrong!');
      }
    );
  }

  getObjArray(obj: []) {
    var result = [];
    obj.forEach((obj) => {
      result.push(obj['type']);
    });
    return result;
  }

  onAddRow(type: string) {
    switch (type) {
      case 'title':
        this.titlerows.push(
          this.formBuilder.group({
            type: '',
          })
        );
        break;
      case 'contact':
        this.contactrows.push(
          this.formBuilder.group({
            type: '',
          })
        );
        break;
      case 'email':
        this.emailrows.push(
          this.formBuilder.group({
            type: '',
          })
        );
        break;
      case 'website':
        this.websiterows.push(
          this.formBuilder.group({
            type: '',
          })
        );
        break;
      case 'address':
        this.addressrows.push(
          this.formBuilder.group({
            type: '',
          })
        );
        break;
      default:
        break;
    }
  }

  onRemoveRow(type: string, rowIndex: number) {
    switch (type) {
      case 'title':
        this.titlerows.removeAt(rowIndex);
        break;
      case 'contact':
        this.contactrows.removeAt(rowIndex);
        break;
      case 'email':
        this.emailrows.removeAt(rowIndex);
        break;
      case 'website':
        this.websiterows.removeAt(rowIndex);
        break;
      case 'address':
        this.addressrows.removeAt(rowIndex);
        break;
      default:
        break;
    }
  }

  drop(event: CdkDragDrop<string[]>, type: string) {
    switch (type) {
      case 'title':
        var a = this.getObjArray(this.aForm.value.titlerows);
        moveItemInArray(a, event.previousIndex, event.currentIndex);
        this.aForm.removeControl('titlerows');
        this.titlerows = this.formBuilder.array([], Validators.required);
        this.aForm.addControl('titlerows', this.titlerows);
        this.setForm(a, this.titlerows);
        break;
      case 'contact':
        var a = this.getObjArray(this.aForm.value.contactrows);
        moveItemInArray(a, event.previousIndex, event.currentIndex);
        this.aForm.removeControl('contactrows');
        this.contactrows = this.formBuilder.array([], Validators.required);
        this.aForm.addControl('contactrows', this.contactrows);
        this.setForm(a, this.contactrows);
        break;
      case 'email':
        var a = this.getObjArray(this.aForm.value.emailrows);
        moveItemInArray(a, event.previousIndex, event.currentIndex);
        this.aForm.removeControl('emailrows');
        this.emailrows = this.formBuilder.array([], Validators.required);
        this.aForm.addControl('emailrows', this.emailrows);
        this.setForm(a, this.emailrows);
        break;
      case 'website':
       var a = this.getObjArray(this.aForm.value.websiterows);
        this.aForm.removeControl('websiterows');
        this.websiterows = this.formBuilder.array([], Validators.required);
        this.aForm.addControl('websiterows', this.websiterows);
        this.setForm(a, this.websiterows);
        break;
      case 'address':
        var a = this.getObjArray(this.aForm.value.addressrows);
        this.aForm.removeControl('addressrows');
        this.addressrows = this.formBuilder.array([], Validators.required);
        this.aForm.addControl('addressrows', this.addressrows);
        this.setForm(a, this.addressrows);
        break;
      default:
        break;
    }

  }

}
