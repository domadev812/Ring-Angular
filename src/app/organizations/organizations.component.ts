import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { OrganizationService  } from '../app.services-list';
import { SchoolsTableComponent } from './schools-table/schools-table.component';
import { SponsorsTableComponent } from './sponsors-table/sponsors-table.component';
import { NavbarService } from '../app.services-list';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
  
  tab: String;

  constructor(
    private navBarService: NavbarService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.tab = 'schools';
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

}
