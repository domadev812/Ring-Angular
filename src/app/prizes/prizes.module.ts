import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { PrizesComponent } from './prizes.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PrizeAddComponent } from './prizesindex/prizeadd/prizeadd.component';
import { CampaignComponent } from './prizesindex/prizeadd/campaign/campaign.component';
import { PrizesIndexComponent } from './prizesindex/prizesindex.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    PrizesComponent,
    PrizeAddComponent,
    CampaignComponent,
    PrizesIndexComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedModule,    
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    Services.PrizesService
  ]
})
export class PrizesModule { }
