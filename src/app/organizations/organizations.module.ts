import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { LoadingModule } from 'ngx-loading';

import { apiFactory } from '../_factories/api.factory';
import { AuthGuard } from '../_guards/auth.guard';
import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationAddComponent } from './organizationadd/organizationadd.component';
import { SchoolsTableComponent } from './schools-table/schools-table.component';
import { SponsorsTableComponent } from './sponsors-table/sponsors-table.component';
import { CommunitiesTableComponent } from './communities-table/communities-table.component';
import { SharedModule } from '../shared.module';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    OrganizationsComponent,
    SchoolsTableComponent,
    SponsorsTableComponent,
    OrganizationAddComponent,
    CommunitiesTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FileUploadModule,
    LoadingModule,
  ],
  providers: [
    {
      provide: Http,
      useFactory: apiFactory,
      deps: [XHRBackend, RequestOptions]
    },
    AuthGuard,
    Services.AuthService,
  ]
})
export class OrganizationsModule { }
