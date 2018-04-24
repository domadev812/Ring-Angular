import * as moment from 'moment';
import { BaseUser } from './base-user.model';
import { User } from './user.model';

export class KeycardRecipient {
  id: string;
  code: string;
  prize: string;
  delivered_at: any;
  awarded: any;
  first_name: string;
  last_name: string;
  redeemed_by: string;
  exported_date: any;
  created_at: any;
  updated_at: any;
  deleted_at: any;
  activated_at: any;
  redeemed_at: any;
  redeemed_by_user: Array<User>;
  activated_by_user: Array<BaseUser>;

  constructor(data = null) {
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {
    this.id = data.id || this.id;
    this.prize = data.type || this.prize;
    this.code = data.code || this.code;
    this.redeemed_by_user = data.redeemed_by_user || {};
    this.activated_by_user = data.activated_by_user || {};
    this.exported_date = data.exported_date ? moment(data.exported_date, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.deleted_at = data.deleted_at ? moment(data.deleted_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : null;
    this.activated_at = data.activated_at ? moment(data.activated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : null;
    this.redeemed_at = data.redeemed_at ? moment(data.redeemed_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : null;
  }
}