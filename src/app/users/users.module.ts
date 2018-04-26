import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LoadingModule } from 'ngx-loading';

import { apiFactory } from '../_factories/api.factory';
import { AuthGuard } from '../_guards/auth.guard';
import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { UsersComponent } from './users.component';
import { StudentsComponent } from './students/students.component';
import { KeyContactsComponent } from './keycontacts/keycontacts.component';
import { CounselorsComponent } from './counselors/counselors.component';
import { CommunitiesComponent } from './communities/communities.component';
import { UserAddComponent } from './useradd/useradd.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    StudentsComponent,
    KeyContactsComponent,
    CounselorsComponent,
    CommunitiesComponent,
    UserAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedModule,
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
    Services.ResourcesService,
    Services.UsersService
  ]
})
export class UsersModule { }

