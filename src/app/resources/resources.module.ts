import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-bootstrap';

import { apiFactory } from '../_factories/api.factory';
import { AuthGuard } from '../_guards/auth.guard';
import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { ResourcesComponent } from './resources.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { OpportunityAddComponent } from './opportunities/opportunityadd/opportunityadd.component';
import { InternshipsComponent } from './internships/internships.component';
import { InternshipAddComponent } from './internships/internshipadd/internshipadd.component';
import { ScholarshipsComponent } from './scholarships/scholarships.component';
import { AppliedUserComponent } from './appliedusers/appliedusers.component';
import { ScholarshipAddComponent } from './scholarships/scholarshipadd/scholarshipadd.component';
import { ScholarshipApplicantsComponent } from './scholarships/applicants/scholarshipapplicants.component';
import { ScholarshipApplicationComponent } from './scholarships/application/scholarshipapplication.component';
import { InfiniteScrollerDirective } from '../_directives/infinite-scroll.directive';
import { SharedModule } from '../shared.module';
import { MouseWheelDirective } from '../_directives/mousewheel.directive';

@NgModule({
  declarations: [
    ResourcesComponent,
    ScholarshipsComponent,
    OpportunitiesComponent,
    OpportunityAddComponent,
    InternshipsComponent,
    InternshipAddComponent,
    AppliedUserComponent,
    ScholarshipAddComponent,
    ScholarshipApplicantsComponent,
    ScholarshipApplicationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedModule,
    LoadingModule,
    TooltipModule.forRoot()
  ],
  providers: [
    Services.ResourcesService,
    Services.MultiSelectService
  ]
})
export class ResourcesModule { }

