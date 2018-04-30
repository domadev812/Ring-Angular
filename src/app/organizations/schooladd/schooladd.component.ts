import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../app.services-list';
import { Router, Routes, RouterModule } from '@angular/router';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-schooladd',
  templateUrl: './schooladd.component.html',
  styleUrls: ['./schooladd.component.scss']
})
export class SchooladdComponent implements OnInit {
  public organization: Model.Organization;
  public title: string;
  public creating = false;

  constructor(
    private navBarService: NavbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('organizations');
    this.organization = new Model.Organization({});
    this.title = 'Add School';
  }

}
