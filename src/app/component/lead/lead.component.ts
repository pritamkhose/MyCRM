import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";

import { Lead } from "../lead.model";
import { LeadService } from "../../service/lead.service";

// https://stackblitz.com/angular/dnbermjydavk?file=app%2Ftable-overview-example.ts
// https://stackblitz.com/edit/dynamic-columns-mat-table?file=app%2Ftable-pagination-example.ts
// https://code-maze.com/angular-material-table/

@Component({
  selector: "app-lead",
  templateUrl: "./lead.component.html",
  styleUrls: ["./lead.component.scss"]
})
export class LeadComponent implements OnInit {
  
  columns = [
    {
      columnDef: "accessusers",
      header: "Access Users",
      cell: (element: any) => `${element.accessusers}`
    },
    {
      columnDef: "contact",
      header: "Contact",
      cell: (element: any) => `${element.contact}`
    },
    {
      columnDef: "probability",
      header: "Probability",
      cell: (element: any) => `${element.probability}`
    },
    {
      columnDef: "priority",
      header: "Priority",
      cell: (element: any) => `${element.priority}`
    }
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
  dataSource: MatTableDataSource<Lead>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private router: Router, private aService: LeadService) {}

  ngOnInit() {
    this.aService.getDataList().subscribe((data: Lead[]) => {
      const leads: Lead[] = data;
      this.dataSource = new MatTableDataSource(leads);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  new() {
    this.router.navigate(["/lead/0"]);
  }

  refresh() {
    this.ngOnInit();
  }

  OnClickEvent(aObj, index: number) {
    this.aService.aSendObj = aObj;
    this.router.navigate(["/lead/", aObj._id]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
