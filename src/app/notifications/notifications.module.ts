import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NotificationsComponent } from './notifications.component';
import { NotificationAddComponent } from './notificationadd/notificationadd.component';
import { MessageBoardComponent } from './messageboard/messageboard.component';
import { NotificationlistComponent } from './notificationlist/notificationlist.component';
import { SharedModule } from '../../app/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/multiselect.component';


@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationAddComponent,
    NotificationlistComponent,
    MessageBoardComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LoadingModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    SharedModule,
    AngularMultiSelectModule

  ],
  providers: [
    Services.NotificationsService,
    Services.MessageBoardService,
  ]
})
export class NotificationsModule { }