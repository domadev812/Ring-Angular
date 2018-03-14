import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class NotificationsService {

  constructor(private http: Http) { }

  getNotifications(type: string, offset: number, search: string = '', limit: number = 50): Observable<Model.Notification[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let url = `${environment.apiUrl}/notificationss?offset=${offset}&limit=${limit}&${paramType}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Notification');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  createNotification(notification: Model.Notification): Observable<Model.Notification> {
    let url = environment.apiUrl + '/notifications/';
    return this.http.post(url, notification)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Notification(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getNotification(notificationId: string): Observable<Model.Notification> {
    let url = environment.apiUrl + '/notifications/' + notificationId;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Notification(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
  updateNotification(notification: Model.Notification): Observable<boolean> {
    let url = environment.apiUrl + '/notifications/';
    return this.http.post(url, notification)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return true;
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

}
