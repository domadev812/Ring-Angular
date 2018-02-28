import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { GlobalState } from '../global.state';
import { NavbarService } from '../app.services-list';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})

export class ResourcesComponent implements OnInit {

  selectedTab: String = '';

  constructor(
    private router: Router,
    public global: GlobalState,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    if (this.global.selectedTab === '') {
      this.selectedTab = 'scholarships';
    } else {
      this.selectedTab = this.global.selectedTab;
    }
    this.global.selectedTab = '';
  }

  addNewResource(pathName): void {
    this.router.navigate([pathName]);
  }

  addNewScholarship(): void {
    this.router.navigate(['scholarshipadd']);
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }
}
