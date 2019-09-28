import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { LeadService } from '../../service/lead.service';

// https://stackblitz.com/angular/dnbermjydavk?file=app%2Ftable-overview-example.ts
// https://code-maze.com/angular-material-table/

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  aList: any;

  constructor(private router: Router, private aService: LeadService) { }

  ngOnInit() {
    this.aList = [];
    this.aService.getDataList()
      .subscribe((data) => {
        this.aList = data;
      });
  }

  new() {
    this.router.navigate(['/lead/0']);
  }

  refresh() {
    this.ngOnInit();
  }

  OnClickEvent(aObj, index: number) {
    this.aService.aSendObj = aObj;
    this.router.navigate(['/lead/', aObj._id]);
  }

  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.aList.filter = filterValue;
  }

}
