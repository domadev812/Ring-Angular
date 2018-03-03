import * as moment from 'moment';
import { CareerGroup } from './career-group.model';
export class Career {
  id: string;
  title: string;
  career_group_id: string;
  career_group: CareerGroup;
  created_at: any;
  updated_at: any;
  career_ids: string;
  career_title: string;
  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.career_group_id = data.career_group_id || this.career_group_id;
    this.career_group = data.career_group || this.career_group;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}
