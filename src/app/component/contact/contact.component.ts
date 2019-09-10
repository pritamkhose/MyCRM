import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Contact } from './contact.model';
import { ContactService } from '../../service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  aList: any;

  constructor(private router: Router, private aService: ContactService) { }

  ngOnInit() {
    this.aList = [];
    this.aService.getDataList()
      .subscribe((data) => {
        // console.log(data);
        this.aList = data;
      });
  }

  new() {
    this.router.navigate(['/contact/0']);
  }

  refresh() {
    this.ngOnInit();
  }

  OnClickEvent(aObj: Contact, index: number) {
    this.aService.aSendObj = aObj;
    this.router.navigate(['/contact/', aObj._id]);
  }

}
