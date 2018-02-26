import * as moment from 'moment';
export class PrizeRelease {
  id: string;  
  qty: number;
  activation_start: any;  
  activation_end: any;
  campaign_id: string;  
  created_at: any;
  updated_at: any;
  deleted_at: any;
  
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;    
    this.qty = data.qty || this.qty;    
    this.campaign_id = data.campaign_id || this.campaign_id;    
    this.activation_start = data.activation_start ? data.activation_start : new Date();
    this.activation_end = data.activation_end ? data.activation_end : new Date();        
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.deleted_at = data.deleted_at ? moment(data.deleted_at, moment.ISO_8601)
    .format('DD  MMM  YYYY') : null;       
  }
}
