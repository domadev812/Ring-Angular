// import { ENV } from '../config/config.dev';

export class BaseUser {
  email: string;
  first_name: string; 
  last_name: string;
  id: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  profile_image: string;
  reset_pass_exp: string;
  reset_pass_token: string;
  roles: string[];
  unread_count: number;
  fullName: Function;

  constructor() {
    
  }

  setData(data) {
    this.email = data.email || this.email;
    this.first_name = data.first_name || this.first_name;
    this.last_name = data.last_name || this.last_name;
    this.id = data.id || this.id;
    this.password = data.password || this.password;
    this.password_confirmation = data.password_confirmation || this.password_confirmation;
    this.phone_number = data.phone_number || this.phone_number;
    data.images ? this.profile_image = data.images[0] : this.profile_image = null;
    this.reset_pass_exp = data.reset_pass_exp || this.reset_pass_exp;
    this.reset_pass_token = data.reset_pass_token || this.reset_pass_token;
    this.roles = data.roles || this.roles;
    this.unread_count = data.unread_count || this.unread_count;
  }

  getName(): string | undefined {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    } else if (this.first_name || this.last_name) {
      return this.first_name || this.last_name;
    } else {
      return undefined;
    }
  }

  getInitials(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name[0]}${this.last_name[0]}`.toUpperCase();
    } else {
      return this.email.substring(0, 2).toUpperCase();
    }
  }

  getAvatarUrl(): string | undefined {
    if (this.profile_image) {
        //TODO: Get the right environment imported into file
    //   return `${ENV.API_URL}/assets/images/${this.id}/${this.profile_image}`;
    } else {
      return 'assets/icon/account_icon.svg';
    }
  }

  getNameOrEmail(): string {
    if (this.first_name || this.last_name) {
      return this.getName();
    } else {
      return this.email;
    }
  }
}
