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
  NgForm,
  Validators
} from '@angular/forms';

import { Product } from '../product.model';
import { ProductService } from '../../../service/product.service';
import { MyErrorStateMatcher } from '../../../util/myerror-state-matcher';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  aObj: any;
  matcher = new MyErrorStateMatcher();
  isSaved = false;
  totalPrice = 0;

  constructor(
    private directrouter: Router,
    private router: ActivatedRoute,
    private aService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      brand: [null, Validators.required],
      price: [null, Validators.required],
      discount: [null],
      //  discount: (this.aObj.discount !== undefined) ? this.aObj.discount : null,
      description: [null, Validators.required],
      // specifications:[null, Validators.nullValidator],
      image: [null, Validators.required]
      // email: [null, Validators.required]
    });
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

  updateTotalPrice() {
    const price = this.productForm.get('price').value;
    if (price !== undefined) {
      let d = this.productForm.get('discount').value;
      if (d === undefined) {
        d = 0;
      }
      this.totalPrice = price - d;
      if (this.totalPrice < 0) {
        alert('Invalid discount');
        this.productForm.get('discount').setValue(0);
        this.updateTotalPrice();
      }
    } else {
      this.totalPrice = 0;
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
        this.directrouter.navigate(['/product']);
      }
    );
  }

  setData() {
    this.productForm.setValue({
      name: this.aObj.name,
      brand: this.aObj.brand,
      description: this.aObj.description,
      price: this.aObj.price !== undefined ? this.aObj.price : 0,
      discount: this.aObj.discount !== undefined ? this.aObj.discount : 0,
      image: this.aObj.image
    });
  }

  list() {
    this.directrouter.navigate(['/product']);
  }

  new() {
    this.productForm.reset();
    this.directrouter.navigate(['/product/0']);
  }

  delete() {
    this.directrouter.navigate(['/product']);
    this.aService.deleteData(this.aObj._id).subscribe(
      res => {
        // console.log('Deleted Suceefully --> ' + JSON.stringify(res));
        this.list();
      },
      err => {
        console.error(JSON.stringify(err));
        alert('Something Went wrong!');
        this.directrouter.navigate(['/product/', this.aObj._id]);
      }
    );
  }

  onFormSubmit(form: NgForm) {
    // console.log(form);
    if (this.isSaved) {
      this.aService.updateData(this.aObj._id, form).subscribe(
        res => {
          this.directrouter.navigate(['/product/', this.aObj._id]);
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
          // this.directrouter.navigate(['/product/', res.insertedIds[0]]);
          const cID = res['insertedIds'][0];
          this.directrouter.navigate(['/product/', cID]);
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
}
