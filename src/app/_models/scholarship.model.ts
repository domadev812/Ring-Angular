import * as moment from 'moment';
export class Scholarship {
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
  careers: Array<string>;
  amount: string;
  number_available: string;
  ethnicities: Array<string>;
  schools: Array<string>;
  organization: string;
  career_titles: Array<number>;
  ethnicity_ids: Array<string>;
  school_ids: Array<string>;
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.link = data.link || this.link;
    this.details = data.details || this.details;
    this.images = data.images || this.images;
    this.is_active = data.is_active || this.is_active;
    this.organization_id = data.organization_id || this.organization_id;
    this.careers = data.careers || this.careers;
    this.career_titles = data.careers || this.careers;
    this.ethnicity_ids = data.ethnicities || this.ethnicities;
    this.organization = data.organization || this.organization;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}
