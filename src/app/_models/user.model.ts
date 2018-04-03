import { BaseUser } from './base-user.model';
import { Organization } from './organization.model';
import * as moment from 'moment';
export class User extends BaseUser {
  hometown: string;
  bio: string;
  organization_id: string;
  organization: Organization;
  type: string;
  created_at: any;
  updated_at: any;
  points: any;

  constructor(data) {
    super();
    this.setData(data);
  }

  setData(data) {
    super.setData(data);
    this.hometown = data.hometown || this.hometown;
    this.bio = data.bio || this.bio;
    this.organization_id = data.organization_id || this.organization_id;
    this.organization = data.organization || this.organization;
    this.type = data.type || this.type;
    this.points = data.points;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }

  getRole(): string {
    return this.roles[0];
  }
}
