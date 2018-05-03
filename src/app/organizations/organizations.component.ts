import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, Routes, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { OrganizationService } from '../app.services-list';
import { SchoolsTableComponent } from './schools-table/schools-table.component';
import { SchoolGroupsTableComponent } from './schoolgroups-table/schoolgroups-table.component';
import { SponsorsTableComponent } from './sponsors-table/sponsors-table.component';
import { CommunitiesTableComponent } from './communities-table/communities-table.component';
import { NavbarService } from '../app.services-list';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
  scrollClass: String = 'table-content-without-search';
  tab: String;

  constructor(
    private navBarService: NavbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('organizations');
    this.tab = 'schools';
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

  addOrganization(type: string): void {
    this.router.navigate(['organizationadd/' + type]);
  }
  newGroup(): void {
    this.router.navigate(['newgroup']);
  }

  addSchool(type: string): void {
    this.router.navigate(['organizationadd/' + type]);
  }

}