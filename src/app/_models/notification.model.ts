import * as moment from 'moment';
export class Notification {
  id: string;
  subject: string;
  body: string;
  organization_id: number;
  creator_id: number;
  type: string;
  custom_group_id: string;
  type_value: string;
  type_ids: Array<string>;
  created_at: any;
  updated_at: any;
  resource: Array<any>;
  approved: boolean;
  organization_name: string;

  constructor(data = null) {
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {
    this.id = data.id || this.id;
    this.subject = data.subject || this.subject;
    this.body = data.body || this.body;
    this.organization_id = data.organization_id || this.organization_id;
    this.organization_name = data.organization_name || this.organization_name;
    this.creator_id = data.creator_id || this.creator_id;
    this.type = data.type || this.type;
    this.custom_group_id = data.custom_group_id || this.custom_group_id;
    this.type_value = data.type_value || this.type_value;
    this.type_ids = data.type_ids || this.type_ids;
    this.resource = data.resource || this.resource;
    this.approved = data.approved || this.approved;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}