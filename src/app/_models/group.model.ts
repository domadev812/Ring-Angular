import * as moment from 'moment';
import { Campaign } from './campaign.model';
import { Organization } from './organization.model';
import { Prize } from './prize.model';

export class Group {
  id: string;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  name: string;
  organizations: Array<Organization>;
  prizes: Array<Prize>;



  constructor(data) {         
    this.setData(data);
  }

  setData(data) {    
    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.organizations = data.organizations || this.organizations;    
    this.prizes = data.organization_id || this.prizes;      
    
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