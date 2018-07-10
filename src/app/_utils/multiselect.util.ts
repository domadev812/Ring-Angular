import { Model } from '../app.models-list';
import { User } from '../_models/user.model';
import { Organization } from '../_models/organization.model';

export module MultiSelectUtil {

  export interface ISelectSettings {
    singleSelection?: boolean;
    text?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    enableSearchFilter?: boolean;
    maxHeight?: number;
    badgeShowLimit?: number;
    classes?: string;
    limitSelection?: number;
    disabled?: boolean;
    searchPlaceholderText?: string;
    groupBy?: string;
    searchAutofocus?: boolean;
    labelKey?: string;
    primaryKey?: string;
    position?: string;
    noDataLabel?: string;
    searchBy?: any[];
  }
  export function multiSettings(config?: ISelectSettings): ISelectSettings {
    return {
      text: 'MAKE SELECTION',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: 'kts-multiselect',
      unSelectAllText: 'Deselect All',
      singleSelection: false,
      ...config
    };
  }

  export function selectAllMultiSettings(config?: ISelectSettings): ISelectSettings {
    return {
      text: 'MAKE SELECTION',
      enableCheckAll: true,
      enableSearchFilter: true,
      classes: 'kts-multiselect',
      unSelectAllText: 'Deselect All',
      singleSelection: false,
      ...config
    };
  }

  export function singleSelection(config?: ISelectSettings): ISelectSettings {
    return {
      text: 'MAKE SELECTION',
      enableCheckAll: false,
      enableSearchFilter: true,
      classes: 'kts-multiselect',
      unSelectAllText: 'Deselect All',
      singleSelection: true,
      ...config
    };
  }

  export const singleDeliverySelection = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'Deselect All',
    singleSelection: true,

  };
  export const notificationRecipientCategory = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'Deselect All',
    singleSelection: true,

  };

  export const orgType = [
    { 'id': 1, 'itemName': 'For Profit Business' },
    { 'id': 2, 'itemName': 'Post-Secondary Education Institution' },
    { 'id': 3, 'itemName': 'Nonprofit Organization ' },
    { 'id': 4, 'itemName': 'Other' }
  ];

  export class SelectItem {

    constructor(public itemName: string, public id: string) { }

    static model_values: any = {
      School: 'name',
      Career: 'title',
      Organization: 'name',
      Group: 'name',
      CareerGroup: 'title',
    };

    static buildFromData(data: any, model_name: string): SelectItem[] {
      return data.map((item: any) => {
        return new SelectItem(item[this.model_values[model_name]], item.id);

      });
    }
  }

  export function isListed(organizations: Organization[], user: User): boolean {
    const schoolList = organizations.filter((organization) => {
      return organization.id === user.organization_id;
    });
    return schoolList.length > 0;
  }
}