import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { Component, OnInit, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { error } from 'util';
import { PrizesService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { Campaign } from '../../../_models/campaign.model';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})

export class CampaignComponent implements OnInit {
  @Input() prizeId;
  @Input() campaigns;
  @Output() refreshPage = new EventEmitter();
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };
  modalType: number;
  modalTitle: string;
  campaignId: number;
  startDate: Date = new Date();
  endDate: Date = new Date();
  minDate: Date = new Date();
  quantity: string;
  redeemed: number;
  released: number;
  selectedIndex: number;
  today: any;

  constructor(private prizesService: PrizesService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.modalType = 0;
    this.modalTitle = 'New Campaign';
    this.today = moment().format('YYYY-MM-DD');
  }

  openModal(template: TemplateRef<any>, index: number = -1): void {
    this.modalRef = this.modalService.show(template, this.config);
    this.campaignId = index === -1 ? 0 : this.campaigns[index].id;
    this.selectedIndex = index;
    if (this.campaignId === 0) {
      this.modalTitle = 'New Campaign';
      this.startDate = new Date();
      this.endDate = new Date();
      this.endDate.setDate(this.endDate.getDate() + 30);
      this.quantity = '';
    } else {
      this.modalTitle = 'Edit Campaign';
      this.startDate = new Date(this.campaigns[index].activation_start);
      this.endDate = new Date(this.campaigns[index].activation_end);
      this.quantity = this.campaigns[index].number_available;
      this.redeemed = this.campaigns[index].redeemed;
      this.released = this.campaigns[index].released;
    }
  }

  tooltip(redeemed: boolean): string {
    if (redeemed) {
      return 'You cannot delete a campaign with redeemed items.';
    } else {
      return '';
    }
  }

  formatDate(date: any): string {
    return date ? moment(date, moment.ISO_8601)
      .format('DD  MMM  YYYY') : '';
  }

  checkValue(): boolean {
    return (parseInt(this.quantity, 0) >= this.redeemed) ? true : false;
  }

  saveCampaign(valid): void {
    if (!valid) {
      return;
    }
    if (!this.startDate || !this.endDate) {
      return;
    }

    let newCampaign = {
      activation_start: this.startDate,
      activation_end: this.endDate,
      number_available: this.quantity,
      release_dates: [{ activation_start: this.startDate, activation_end: this.endDate }]
    };

    if (this.campaignId === 0) {
      this.prizesService.createCampaign(this.prizeId, new Model.Campaign(newCampaign)).subscribe((res) => {
        alert('Campaign is created');
        this.campaigns.push(res);
        this.modalRef.hide();
        this.refreshPage.emit();
      }, (errors) => {
        alert(errors.message);
      });
    } else {
      if (!this.checkValue()) {
        return;
      }

      this.prizesService.updateCampaign(this.prizeId, this.campaignId, this.quantity).subscribe((res) => {
        alert('Campaign is updated');
        this.campaigns.splice(this.selectedIndex, 1, res);
        this.modalRef.hide();
        this.refreshPage.emit();
      }, (errors) => {
        alert(errors.message);
      });
    }
  }

  getStatus(activationStart: Date, activationEnd: Date) {
    const start = moment(activationStart);
    const end = moment(activationEnd);
    if (start.isAfter(moment(this.today))) {
      return 'Future';
    }
    if (moment(this.today).isAfter(end)) {
      return 'Past';
    }
    return 'Current';
  }

  onValueChange(value: Date): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    if (moment(value).isAfter(this.endDate)) {
      this.endDate = moment(value).toDate();
      this.endDate.setDate(this.endDate.getDate() + 1);
    }
  }

  deleteCampaign(campaignId: number, prizeId: string): void {
    this.prizesService.deleteCampaign(this.prizeId, this.campaignId).subscribe((res) => {
      alert('Campaign is deleted');
      this.refreshPage.emit();
      this.modalRef.hide();
    }, (errors) => {
      alert(errors.message);
    });
  }
}
