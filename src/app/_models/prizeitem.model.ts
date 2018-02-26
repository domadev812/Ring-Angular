import * as moment from 'moment';
export class PrizeItem {
  id: string;  
  type: string;
  campaign_id: string;
  redeemed_by: string;
  exported_date: any;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;    
    this.type = data.type || this.type;    
    this.campaign_id = data.campaign_id || this.campaign_id;    
    this.redeemed_by = data.redeemed_by || this.redeemed_by;    
    this.exported_date = data.exported_date ? moment(data.exported_date, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
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
