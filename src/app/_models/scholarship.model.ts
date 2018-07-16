import * as moment from 'moment';
import { Organization } from './organization.model';
import { Career } from './career.model';
import { User } from './user.model';
import { CareerGroup } from './career-group.model';
import { MultiSelectUtil } from '../_utils/multiselect.util';

export enum ScholarshipTypes {
  scholarship = 'scholarship',
  tuition_waiver = 'tuition_waiver'
}
export class Scholarship {
  id: string;
  title: string;
  amount: number;
  number_available: number;
  active: boolean;
  approved: any;
  in_app: boolean;
  type: ScholarshipTypes;
  url: string;
  description: string;
  organization_id: string;
  organization: Organization;
  schools: Array<Organization>;
  careers: Array<Career>;
  career_groups: Array<CareerGroup>;
  images: Array<string>;
  created_at: any;
  updated_at: any;
  career_ids: Array<number>;
  school_ids: Array<number>;
  career_group_ids: Array<number>;
  career_group_title: Array<string>;
  users: Array<User>;


  constructor(data = null) {
    if (data) {
      this.setData(data);
    }
  }

  setData(data) {
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.amount = data.amount || this.amount;
    this.number_available = data.number_available || this.number_available;
    this.active = data.active || false;
    this.in_app = data.in_app || false;
    this.type = data.type || this.type;
    this.url = data.url || this.url;
    this.description = data.description || this.description;
    this.organization_id = data.organization_id || this.organization_id;
    this.approved = data.approved;
    this.career_groups = data.career_groups || this.career_groups;
    this.organization = data.organization || this.organization;
    if (data.schools) {
      this.schools = data.schools.map(school => school);
      this.school_ids = data.schools.map(school => school.id);
    } else {
      this.schools = [];
      this.school_ids = [];
    }
    if (data.careers) {
      this.careers = data.careers.map(career => career);
      this.career_ids = data.careers.map(career => career.id);
    } else {
      this.careers = [];
      this.career_ids = [];
    }
    this.users = data.users || this.users;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
  }

  belongsToUser(user: User): boolean {
    return this.organization_id === user.organization_id;
  }

  getPageState(user: User): 'edit' | 'approval' | 'readonly' | 'new' {
    if (!this.id) return 'new';
    else if (this.isEditable(user)) return 'edit';
    else if (this.isApproval()) return 'approval';
    else return 'readonly';
  }

  buildScholarshipFromForm(
    selectedCareers: MultiSelectUtil.SelectItem[],
    selectedSchools: MultiSelectUtil.SelectItem[],
    selectedOrganization: MultiSelectUtil.SelectItem[],
    tuitionWaiver: boolean
  ): void {
    this.organization_id = selectedOrganization[0].id;
    this.type = tuitionWaiver ? ScholarshipTypes.tuition_waiver : ScholarshipTypes.scholarship;
    this.career_group_ids = selectedCareers.map(career_group => {
      return +career_group.id; // + converts string to number
    });
    this.school_ids = selectedSchools.map(school => {
      return +school.id;
    });

  }
  private isEditable(user: User): boolean {
    return (user.isAdmin() || this.belongsToUser(user)) && this.approved;
  }

  private isApproval(): boolean {
    return !this.approved;
  }

}
