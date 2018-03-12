import * as moment from 'moment';
import { Model } from '../app.models-list';
import { Organization } from './organization.model';
import { Ethnicity } from './ethnicity.model';
import { Career } from './career.model';
export class Scholarship {
  id: string;
  title: string;
  amount: number;
  number_available: number;
  active: boolean;
  is_active: boolean;
  in_app: boolean;
  type: string;
  link: string;
  details: string;
  organization_id: string;
  organization: Organization;
  schools: Array<Organization>;
  ethnicities: Array<Ethnicity>;
  careers: Array<Career>;  
  images: Array<string>;  
  created_at: any;
  updated_at: any;
  
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.amount = data.amount || this.amount;
    this.number_available = data.number_available || this.number_available;
    this.is_active = data.is_active || this.is_active;
    this.active = data.active || this.active;
    this.in_app = data.in_app || this.in_app;
    this.type = data.type || this.type;
    this.link = data.link || this.link;
    this.details = data.details || this.details;    
    this.organization_id = data.organization_id || this.organization_id;
    this.organization = data.organization || this.organization;
    if (data.schools) {
      this.schools = Model.initializeArray(data.organization, 'Organization');
    } else {
      this.schools = [];
    }
    if (data.ethnicities) {
      this.ethnicities = Model.initializeArray(data.ethnicities, 'Ethnicity');
    } else {
      this.ethnicities = [];
    }
    if (data.careers) {
      this.careers = Model.initializeArray(data.careers, 'Career');
    } else {
      this.careers = [];
    }   
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}
