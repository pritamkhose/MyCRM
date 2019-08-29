import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from './product.model';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  aList: any;

  constructor(private router: Router, private aService: ProductService) { }

  ngOnInit() {
    this.aList = [];
    this.aService.getDataList()
      .subscribe((data) => {
        // console.log(data);
        this.aList = data;
      });
  }

  new() {
    this.router.navigate(['/product/']);
  }

  refresh() {
    this.ngOnInit();
  }

  OnClickEvent(aObj: Product, index: number) {
    this.aService.aSendObj = aObj;
    this.router.navigate(['/product/', aObj._id]);
  }

}
