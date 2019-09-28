import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { AlertService } from '../../../service/alert.service';

import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  FormArray,
  NgForm,
  Validators
} from '@angular/forms';

import { LeadItem } from '../lead.model';
import { LeadService } from '../../../service/lead.service';
import { MyErrorStateMatcher } from '../../../util/myerror-state-matcher';

@Component({
  selector: 'app-lead-edit',
  templateUrl: './lead-edit.component.html',
  styleUrls: ['./lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit {

  aForm: FormGroup;
  aObj: any;
  matcher = new MyErrorStateMatcher();
  isSaved = false;
  onBackReload = true;

  // https://stackblitz.com/edit/tag-input?file=app%2Fapp.component.ts
  // https://angular-slider.github.io/angularjs-slider/
  // https://stackoverflow.com/questions/40494968/reactive-forms-disabled-attribute

  disabled = true;
  statusList = ['New', 'Acknowledge', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Completed', 'Cancel'];
  priorityList = ['Normal', 'Low', 'Medium', 'High', 'Urgent', 'Unknown'];
  sourceList = ['Phone', 'Email', 'Skype', 'Unknown'];
  catList = ['Phone', 'Email', 'Skype', 'Unknown'];
  productrows: FormArray;
  calculate = {
    qty: 0,
    price: 0,
    com: 0,
    dis: 0,
    amt: 0
  };

  constructor(
    private directrouter: Router,
    private router: ActivatedRoute,
    private aService: LeadService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) {
    var todayDate = new Date();
    var afterDate = new Date((new Date()).setDate(todayDate.getDate() + 6));
    this.aForm = this.formBuilder.group({
      leadname: [null],
      company: [null],
      contact: [null, Validators.required],
      discount: [null],
      accessusers: [null, Validators.required],
      assignedto: [null, Validators.required],
      status: [this.statusList[0], Validators.required],
      startDate: [todayDate, Validators.required],
      closeDate: [afterDate, Validators.required],
      probability: [10],
      description: [null],
      priority: [this.priorityList[0], Validators.required],
      source: [null, Validators.required],
      tagitems: [null],
      calculate: [this.calculate, []],
      // productrows: [[], []],
    });
    this.productrows = this.formBuilder.array([], Validators.required);
    this.aForm.addControl('productrows', this.productrows);

    directrouter.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          if (this.onBackReload) {
            this.onBackReload = false;
            this.list();
          }
        }
      });
  }

  ngOnInit() {
    if (this.router.snapshot.url[1].path.length > 2) {
      this.isSaved = true;
      if (this.aService.aSendObj != null && this.aService.aSendObj != undefined) {
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
        if (this.aObj != null && this.aObj != undefined) {
          this.aObj = data[0];
          this.setData();
        } else {
          alert('Invalid Data Found!');
          this.directrouter.navigate(['/lead']);
        }

      },
      err => {
        alert('Invalid Data Found!');
        this.directrouter.navigate(['/lead']);
      }
    );
  }

  setData() {
    this.aObj.productrows.forEach((obj : LeadItem) => {
      this.productrows.push(
        this.formBuilder.group({
          cat:  obj.cat,
          productname:  obj.productname,
          qty: obj.qty,
          price: obj.price,
          commissionpercent: obj.commissionpercent,
          commission: obj.commission,
          discountpercent: obj.discountpercent,
          discount: obj.discount,
          taxpercent: obj.taxpercent,
          // tax: 0,
          amount: obj.amount
        }));
    });
    this.aForm.patchValue({
      leadname: this.aObj.leadname !== undefined ? this.aObj.leadname : '',
      company: this.aObj.company !== undefined ? this.aObj.company : '',
      contact: this.aObj.contact,
      discount: this.aObj.price !== undefined ? this.aObj.price : '',
      status: this.aObj.status,
      startDate: this.aObj.startDate,
      closeDate: this.aObj.closeDate,
      probability: this.aObj.probability !== undefined ? this.aObj.probability : '',
      description: this.aObj.description !== undefined ? this.aObj.description : '',
      priority: this.aObj.priority,
      source: this.aObj.source,
      accessusers: this.aObj.accessusers,
      assignedto: this.aObj.assignedto,
      tagitems: this.aObj.tagitems,
      calculate: this.calculate,
    });

    this.calculate.qty = 0;
    this.calculate.price = 0;
    this.calculate.com = 0;
    this.calculate.dis = 0;
    this.calculate.amt = 0;
    for (let i = 0; i < this.productrows.length; i++) {
      this.calculate.qty += parseFloat(this.productrows.at(i).get('qty').value);
      this.calculate.price += parseFloat(this.productrows.at(i).get('price').value);
      this.calculate.com += parseFloat(this.productrows.at(i).get('commission').value);
      this.calculate.dis += parseFloat(this.productrows.at(i).get('discount').value);
      this.calculate.amt += parseFloat(this.productrows.at(i).get('amount').value);
    }
    // this.calculate.com = this.calculate.com - this.calculate.price;
    // this.calculate.dis = this.calculate.dis  - this.calculate.price - this.calculate.dis;
    this.aForm['calculate'] = this.calculate;

  }

  list() {
    this.directrouter.navigate(['/lead']);
  }

  new() {
    this.isSaved = false;
    this.aForm.reset();
    this.directrouter.navigate(['/lead/0']);
    this.aForm.removeControl('productrows');
    this.productrows = this.formBuilder.array([]);
  }

  delete() {
    this.aForm.disabled;
    this.directrouter.navigate(['/lead']);
    this.aService.deleteData(this.aObj._id).subscribe(
      res => {
        if (res['ok'] == '1') {
          this.alertService.toastrError('Deleted');
        } else {
          console.log('Deleted --> ' + JSON.stringify(res));
          this.alertService.toastrError('Unable to Delete');
        }
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
      }
    );
  }

  onFormSubmit(form) {
    // console.log(form);
    if (this.isSaved) {
      this.aService.updateData(this.aObj._id, form).subscribe(
        res => {
          this.directrouter.navigate(['/lead/', this.aObj._id]);
          this.alertService.toastrSuccess('Saved Successfully !');
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
          this.isSaved = true;
          // this.directrouter.navigate(['/lead/', res.insertedIds[0]]);
          const cID = res['insertedIds'][0];
          this.directrouter.navigate(['/lead/', cID]);
          this.alertService.toastrSuccess('Created Successfully !');
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

  formatLabel(value: number | null) {
    if (!value) {
      return 1;
    }
    return value;
  }

  public onTagEdited(item) {
    // console.log('tag edited: current value is ' + item);
  }

  onAddProductRow() {
    this.productrows.push(
      this.formBuilder.group({
        cat: '',
        productname: '',
        qty: 1,
        price: 1,
        commissionpercent: 0,
        commission: 0,
        discountpercent: 0,
        discount: 0,
        taxpercent: 0,
        // tax: 0,
        amount: 0
      })
    );
    this.updateItemPrice(this.productrows.at(this.productrows.length - 1), (this.productrows.length - 1));
  }

  onRemoveProductRow(rowIndex: number) {
    this.productrows.removeAt(rowIndex);
  }

  updateItemPrice(row, index) {
    var price: number = row.value.price * row.value.qty;
    var commission: number = (price + ((row.value.commissionpercent * 1) * (price / 100)));
    var discount: number = (commission - ((row.value.discountpercent * 1) * (commission / 100)));
    var amount: number = (discount + ((row.value.taxpercent * 1) * (discount / 100)));
    this.productrows.at(index).patchValue(
      {
        commission: (Math.round(commission * 1000) / 1000).toFixed(3),
        discount: (Math.round(discount * 1000) / 1000).toFixed(3),
        // tax: (Math.round(amount * 1000)/1000).toFixed(3),
        amount: (Math.round(amount * 1000) / 1000).toFixed(3),
      }
    );
    this.calculate.qty = 0;
    this.calculate.price = 0;
    this.calculate.com = 0;
    this.calculate.dis = 0;
    this.calculate.amt = 0;
    for (let i = 0; i < this.productrows.length; i++) {
      this.calculate.qty += parseFloat(this.productrows.at(i).get('qty').value);
      this.calculate.price += parseFloat(this.productrows.at(i).get('price').value);
      this.calculate.com += parseFloat(this.productrows.at(i).get('commission').value);
      this.calculate.dis += parseFloat(this.productrows.at(i).get('discount').value);
      this.calculate.amt += parseFloat(this.productrows.at(i).get('amount').value);
    }
    // this.calculate.com = this.calculate.com - this.calculate.price;
    // this.calculate.dis = this.calculate.dis  - this.calculate.price - this.calculate.dis;
    this.aForm['calculate'] = this.calculate;

  }

  updatetotalPrice() {

  }

  getAmount(a, b) {
    return a * b;
  }

}