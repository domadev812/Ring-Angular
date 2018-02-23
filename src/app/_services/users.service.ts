import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';

@Injectable()

export class UsersService {

  constructor(private http: Http) {
  }

  getUsers(type: string, offset: number, search: string = '', limit: number = 50): Observable<Model.User[]> {    
    let paramType = type !== '' ? `type=${type}` : '';
    let paramTitle = search !== '' ? `search=${search}` : '';    
    let url = `${environment.apiUrl}/api/users?offset=${offset}&limit=${limit}&${paramType}&${paramTitle}`;      
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();        
        if (json && json.data) {
          return Model.initializeArray(json.data, 'User');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
}