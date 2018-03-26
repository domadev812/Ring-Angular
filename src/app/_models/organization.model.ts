import * as moment from 'moment';
import { User } from './user.model';
import { ImageUtil } from '../_utils/image.util';
export class Organization {
  id: string;
  name: string;
  school_id: string;
  type: string;    
  url: string;  
  images: string[];
  users: Array<User>;  
  created_at: any;
  updated_at: any;  
  
  constructor(data = null) { 
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {    
    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.school_id = data.school_id || this.school_id;
    this.type = data.type || this.type;
    this.url = data.url || this.url;
    this.images = data.images || this.images;
    this.users = data.users || this.users;   
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }

  getImgUrl(): string | null {
    if (this.images) {
      return ImageUtil.createImageUrl(this.id, this.images[this.images.length - 1]);
    }
  }
}
