import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import * as Services from '../app.services-list';
import { routing } from '../app.routing';
import { PrizesComponent } from './prizes.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PrizeAddComponent } from './prizeadd/prizeadd.component';
import { PrizesIndexComponent } from './prizesindex/prizesindex.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    PrizesComponent,
    PrizeAddComponent,
    PrizesIndexComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    SharedModule,    
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  providers: [
    Services.PrizesService
  ]
})
export class PrizesModule { }
