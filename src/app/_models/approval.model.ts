import * as moment from 'moment';
import { Scholarship } from './scholarship.model';
import { Resource } from './resource.model';
import { Notification } from './Notification.model';

export class Approval {
  id: string;
  scholarship: Array<Scholarship>;
  resource: Array<Resource>;
  notification: Array<Notification>;
  title: string;
  content_type: string;
  creator: string;
  created_at: any;
  organization_name: string;
  resource_id: string;

  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.scholarship = data.scholarship || this.scholarship;
    this.resource = data.resource || this.resource;
    this.notification = data.notification || this.notification;
    this.title = data.title || this.title;
    this.content_type = data.content_type || this.content_type;
    this.creator = data.creator || this.creator;
    this.organization_name = data.organization_name || this.organization_name;
    this.resource_id = data.resource_id || this.resource_id;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}