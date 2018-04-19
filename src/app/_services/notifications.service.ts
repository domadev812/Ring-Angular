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

  getNotifications(offset: number = 0, limit: number = 50): Observable<Model.Notification[]> {
    let url = `${environment.apiUrl}/api/notifications/all?offset=${offset}&limit=${limit}`;
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
    let url = environment.apiUrl + '/api/notifications/';
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
    let url = environment.apiUrl + '/api/notifications/' + notificationId;
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
  notificationReject(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/notifications/${id}/reject`;
    return this.http.delete(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Approval(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  notificationApprove(id: string): Observable<Model.Resource> {
    let url = `${environment.apiUrl}/api/notifications/${id}/approve`;
    return this.http.patch(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Resource(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
}
