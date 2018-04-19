import * as moment from 'moment';
import { Career } from './career.model';
import { User } from './user.model';
import { Organization } from './organization.model';
import { Scholarship } from './scholarship.model';
export class Resource {
  id: string;
  title: string;
  link: string;
  details: string;
  type: string;
  images: Array<string>;
  is_active: boolean;
  organization_id: string;
  created_at: any;
  updated_at: any;
  careers: Array<Career>;
  users: Array<User>;
  organization: Organization;
  schools: Array<Organization>;
  scolarship: Scholarship;
  career_titles: Array<number>;
  career_ids: Array<number>;
  career_title: Array<string>;
  approved: boolean;


  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.link = data.link || this.link;
    this.details = data.details || this.details;
    this.type = data.type || this.type;
    this.images = data.images || this.images;
    this.is_active = data.is_active || this.is_active;
    this.organization_id = data.organization_id || this.organization_id;
    this.organization = data.organization || this.organization;
    this.careers = data.careers || this.careers;
    this.career_ids = data.careers || this.careers;
    this.users = data.users || this.users;
    this.organization = data.organization || this.organization;
    this.approved = data.approved || this.approved;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}
