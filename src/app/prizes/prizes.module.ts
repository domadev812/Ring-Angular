import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-bootstrap';

import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { PrizesComponent } from './prizes.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PrizeAddComponent } from './prizeadd/prizeadd.component';
import { CampaignComponent } from './prizeadd/campaign/campaign.component';
import { PrizesIndexComponent } from './prizesindex/prizesindex.component';
import { SharedModule } from '../shared.module';
import { AwardedPrizesIndexComponent } from './awardedprizesindex/awardedprizesindex.component';
import { KeycardindexComponent } from './keycardindex/keycardindex.component';

@NgModule({
  declarations: [
    PrizesComponent,
    PrizeAddComponent,
    CampaignComponent,
    PrizesIndexComponent,
    AwardedPrizesIndexComponent,
    KeycardindexComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LoadingModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    SharedModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    Services.PrizesService
  ]
})
export class PrizesModule { }
