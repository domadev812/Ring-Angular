import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { OrganizationService  } from '../_services/organization.service';
import { SchoolsTableComponent } from './schools-table/schools-table.component';
import { SponsorsTableComponent } from './sponsors-table/sponsors-table.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
  
  tab: String;

  constructor() { }

  ngOnInit() {
    this.tab = 'schools';
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

}
