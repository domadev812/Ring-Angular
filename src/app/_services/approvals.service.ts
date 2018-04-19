import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import { Approval } from '../_models/approval.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ApprovalsService {

  constructor(private http: Http) { }


  getApprovals(): Observable<Model.Approval[]> {
    let url = `${environment.apiUrl}/api/approvals`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Approval');
        } else {
          Observable.throw({
            messages: 'Internal Server Error', response
          });
        }
      });
  }

  notificationsApprove(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/notifications/${id}/approve`;
    return this.http.patch(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Approval(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  notificationReject(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/notifications/${id}/reject`;
    return this.http.patch(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Approval(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
}
