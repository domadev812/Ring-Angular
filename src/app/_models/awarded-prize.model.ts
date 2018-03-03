import * as moment from 'moment';
// import { Prize } from './prize.model';
export class AwardedPrize {
  id: string;
  title: string;
  redeemed_at: string;
  redeemed_by: string;
  delivered_at: string;
  delivery_type: string;
  user_school: string;

  constructor(data) {
    this.setData(data);
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.redeemed_at = data.redeemed_at || this.redeemed_at ? moment(data.redeemed_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.redeemed_by = data.redeemed_by || this.redeemed_by;
    this.delivery_type = data.delivery_type || this.delivery_type;
    this.user_school = data.user_school || this.user_school;
    this.delivered_at = data.delivered_at ? moment(data.delivered_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');

  }
}