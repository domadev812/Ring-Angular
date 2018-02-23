import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { apiFactory } from '../_factories/api.factory';
import { AuthGuard } from '../_guards/auth.guard';
import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { OrganizationsComponent } from './organizations.component';
import { SchoolsTableComponent } from './schools-table/schools-table.component';
import { SponsorsTableComponent } from './sponsors-table/sponsors-table.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    OrganizationsComponent,
    SchoolsTableComponent,
    SponsorsTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
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
