import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { GlobalState } from '../global.state';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  selectedTab: String = '';  

  constructor(private router: Router, public global: GlobalState) { }

  ngOnInit() { 
    if (this.global.selectedTab === '') {      
      this.selectedTab = 'scholarships';    
    } else {
      this.selectedTab = this.global.selectedTab;
    }    
  }

  addNewResource(pathName): void {
    this.router.navigate([pathName]);
  }

  addNewScholarship(event): void {
    this.router.navigate(['scholarshipadd']);
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }
}
