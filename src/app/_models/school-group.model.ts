import * as moment from 'moment';
import { Organization } from './organization.model';

export class SchoolGroup {
  id: string;
  title: string;
  schools: Array<Organization>;
  created_at: any;
  updated_at: any;
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.schools = data.organization || this.schools;
    if (data.schools) {
      this.schools = data.schools.map(school => school);
    } else {
      this.schools = [];
      this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
        .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
          .format('DD  MMM  YYYY');
      this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
        .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
          .format('DD  MMM  YYYY');
    }
  }
}