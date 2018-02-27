import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { apiFactory } from './_factories/api.factory';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import * as Components from './app.components-list';
import * as Services from './app.services-list';
import { routing } from './app.routing';
import { UsersModule } from './users/users.module';
import { PrizesModule } from './prizes/prizes.module';
import { ResourcesModule } from './resources/resources.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { Component } from '@angular/core/src/metadata/directives';
import { Api } from './_providers/api.provider';
import { NotificationsModule } from './notifications/notifications.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { GlobalState } from './global.state';


@NgModule({
  declarations: [
    Components.AppComponent,
    Components.LoginComponent,
    Components.NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    ToastModule.forRoot(),
    UsersModule,
    PrizesModule,
    ResourcesModule,
    AngularMultiSelectModule,
    NotificationsModule,
    OrganizationsModule
  ],
  providers: [
    {
      provide: Api,
      useFactory: apiFactory,
      deps: [XHRBackend, RequestOptions]
    },
    AuthGuard,
    RoleGuard,
    Services.AuthService,
    Services.CurrentUserService,
    Services.AccessService,
    Services.OrganizationService,
    Services.MultiSelectService,
    Services.NavbarService,
    GlobalState,
  ],
  bootstrap: [Components.AppComponent]
})
export class AppModule { }

