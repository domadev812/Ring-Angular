import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { MultiSelectUtil } from '../_utils/multiselect.util';

@Injectable()

export class MultiSelectService {
  public schoolsSelect: MultiSelectUtil.SelectItem[];
  public careersSelect: MultiSelectUtil.SelectItem[];
  public ethnicitiesSelect: MultiSelectUtil.SelectItem[];
  public organizationsSelect: MultiSelectUtil.SelectItem[];
  public sponsorsSelect: MultiSelectUtil.SelectItem[];

  constructor(private http: Http) {

  }

  getDropdownSchools(): Observable<MultiSelectUtil.SelectItem[]> {
    if (this.schoolsSelect) {
      return Observable.of(this.schoolsSelect);
    }
    let url = `${environment.apiUrl}/api/organization/schools`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          this.schoolsSelect = MultiSelectUtil.SelectItem.buildFromData(json.data, 'School');
          return this.schoolsSelect;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

  getDropdownCareers(): Observable<MultiSelectUtil.SelectItem[]> {
    if (this.careersSelect) {
      return Observable.of(this.careersSelect);
    }
    let url = `${environment.apiUrl}/api/careers`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          this.careersSelect = MultiSelectUtil.SelectItem.buildFromData(json.data, 'Career');
          return this.careersSelect;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

  getDropdownOrganizations(): Observable<MultiSelectUtil.SelectItem[]> {
    if (this.organizationsSelect) {
      return Observable.of(this.organizationsSelect);
    }
    let url = `${environment.apiUrl}/api/organization`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          this.organizationsSelect = MultiSelectUtil.SelectItem.buildFromData(json.data, 'Organization');
          return this.organizationsSelect;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

  getDropdownSponsors(): Observable<MultiSelectUtil.SelectItem[]> {
    if (this.sponsorsSelect) {
      return Observable.of(this.sponsorsSelect);
    }
    let url = `${environment.apiUrl}/api/organization?type=sponsor`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          this.sponsorsSelect = MultiSelectUtil.SelectItem.buildFromData(json.data, 'Organization');
          return this.sponsorsSelect;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }
}