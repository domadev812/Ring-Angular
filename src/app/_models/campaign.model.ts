import * as moment from 'moment';
import { PrizeItem } from './prizeitem.model';
export class Campaign {
  id: string;
  activation_start: any;  
  activation_end: any;
  number_available: string;
  prize_id: string;
  prize_campaigns: Array<PrizeItem>;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;   
    this.activation_start = data.activation_start ? moment(data.activation_start, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.activation_end = data.activation_end ? moment(data.activation_end, moment.ISO_8601)
    .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
      .format('DD  MMM  YYYY');   
    this.prize_id = data.prize_id || this.prize_id; 
    this.number_available = data.number_available || this.number_available; 
    this.prize_campaigns = data.prize_campaigns || this.prize_campaigns;       
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.deleted_at = data.deleted_at ? moment(data.deleted_at, moment.ISO_8601)
    .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
      .format('DD  MMM  YYYY'); 
  }
}
