import { Model } from '../app.models-list';

export module MultiSelectUtil {

  export const multiSettings = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'DeSelect All',
    singleSelection: false,
  };
  export const selectAllMultiSettings = {
    text: 'MAKE SELECTION',
    enableCheckAll: true,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'DeSelect All',
    singleSelection: false,
  };

  export const singleSelection = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'DeSelect All',
    singleSelection: true,
  };

  export const singleDeliverySelection = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'DeSelect All',
    singleSelection: true,

  };
  export const notificationRecipientCategory = {
    text: 'MAKE SELECTION',
    enableCheckAll: false,
    enableSearchFilter: true,
    classes: 'kts-multiselect',
    unSelectAllText: 'DeSelect All',
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
    };

    static buildFromData(data: any, model_name: string): SelectItem[] {
      return data.map((item: any) => {
        return new SelectItem(item[this.model_values[model_name]], item.id);

      });
    }
  }
}