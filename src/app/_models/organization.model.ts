import * as moment from 'moment';
import { User } from './user.model';
export class Organization {
  id: string;
  name: string;
  school_id: string;
  type: string;    
  url: string;  
  details: string;
  is_active: boolean;
  users: Array<User>;  
  created_at: any;
  updated_at: any;  
  
  constructor(data) {         
    this.setData(data);
  }

  setData(data) {    
    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.school_id = data.school_id || this.school_id;
    this.type = data.type || this.type;
    this.details = data.details || this.details;
    this.is_active = data.is_active || this.is_active;
    this.url = data.url || this.url;
    this.users = data.users || this.users;   
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }
}
