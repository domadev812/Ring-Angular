import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import { environment } from '../../environments/environment';

@Injectable()

export class OrganizationService {
  constructor(private http: Http) { }
  
  getOrganizationSearch(type: string, offset: number, limit: number = 50, search: string = ''): Observable<Model.Organization[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let paramTitle = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/organization?offset=${offset}&limit=${limit}&${paramType}&${paramTitle}`; 
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Organization');
        } else {
          Observable.throw({message: 'Internal Server Error', response});
        }
      });
  }
  
  createOrganizationUrl(): string {
    let url = '/organization?';

    let i;
    return url;
  }

}