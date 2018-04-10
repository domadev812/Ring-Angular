import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { MultiSelectUtil } from '../_utils/multiselect.util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { Model } from '../app.models-list';
import { environment } from '../../environments/environment';

@Injectable()
export class MessageBoardService {

  constructor(private http: Http) {

  }

  getMessage(): Observable<Model.MessageBoard> {
    return this.http.get(`/messageboard`)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data[0]) {
          return new Model.MessageBoard(json.data[0]);
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

  updateMessage(updateMessage: Model.MessageBoard): Observable<Model.MessageBoard> {
    let url = `${environment.apiUrl}/api/messageboard/`;
    return this.http.post(url, updateMessage)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.MessageBoard(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
}