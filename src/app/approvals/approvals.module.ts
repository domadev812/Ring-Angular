import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalsComponent } from './approvals.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import * as Services from '../app.services-list';
import { LoadingModule } from 'ngx-loading';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { apiFactory } from '../_factories/api.factory';
import { AuthGuard } from '../_guards/auth.guard';
import { routing } from '../app.routing';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    LoadingModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  declarations: [ApprovalsComponent],
  providers: [
    Services.ApprovalsService,
  ]
})
export class ApprovalsModule { }
