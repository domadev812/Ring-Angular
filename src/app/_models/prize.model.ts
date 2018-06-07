import * as moment from 'moment';
import { Campaign } from './campaign.model';
import { Organization } from './organization.model';
import { Group } from './group.model';

export class Prize {
  id: string;
  title: string;
  points: number;
  delivery_type: string;
  organization_id: string;
  images: Array<string>;
  prize_campaigns: Array<Campaign>;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  organization: Organization;
  group_ids: Array<Group>;
  groups: Array<Group>;
  organization_name: string;
  quantity: number;
  redeemed: number;
  period: string;


  constructor(data) {
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.delivery_type = data.delivery_type || this.delivery_type;
    this.organization_id = data.organization_id || this.organization_id;
    this.points = data.points || this.points;
    this.images = data.images || this.images;
    if (data.group_ids) {
      this.group_ids = [];
    }
    this.groups = data.groups || this.groups;
    if (data.prize_campaigns) {
      this.prize_campaigns = data.prize_campaigns.map(campaign => new Campaign(campaign));
    }

    this.organization = data.organization ? data.organization : new Organization();
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.deleted_at = data.deleted_at ? moment(data.deleted_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : null;
    this.organization_name = data.organization_name;
    this.quantity = data.quantity;
    this.redeemed = data.redeemed;
    this.period = data.period;
  }

}
