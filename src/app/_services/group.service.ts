import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import { environment } from '../../environments/environment';
import { FileUploader } from 'ng2-file-upload';

@Injectable()

export class GroupService {

  public uploader: FileUploader;

  constructor(private http: Http, ) {
    const URL = `${environment.apiUrl}/api/assets/upload`;
    this.uploader = new FileUploader({ url: URL, itemAlias: 'files', removeAfterUpload: true, method: 'POST' });
  }

  createGroup(group: Model.Group): Observable<Model.Group> {
    let url = `${environment.apiUrl}/api/groups`;
    return this.http.post(url, group)
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.Group(json);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  updateGroup(group: Model.Group): Observable<Model.Group> {
    let url = `${environment.apiUrl}/api/groups/${group.id}`;
    return this.http.patch(url, group)
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.Group(json);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getGroupSearch(type: string, offset: number, limit: number = 50, search: string = ''): Observable<Model.Group[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let paramTitle = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/groups?offset=${offset}&limit=${limit}&${paramType}&${paramTitle}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Group');
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }

  createGroupUrl(): string {
    let url = '/groups?';

    let i;
    return url;
  }

  getSchoolGroups(type: string, offset: number, limit: number = 50, search: string = ''): Observable<Model.Group[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/groups?offset=${offset}&limit=${limit}&${paramType}&${paramSearch}`;
    return this.http.get(url)
      .map((res: Response) => {
        const json = res.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Group');
        } else {
          Observable.throw({ message: 'Internal Server Error', res });
        }
      });
  }

  uploadImage(groupId: string): void {
    let token = localStorage.getItem('Token');
    this.uploader.onBeforeUploadItem = (item: any) => {
      item.withCredentials = false;
      this.uploader.authToken = 'Bearer ' + token;
      this.uploader.options.additionalParameter = {
        resource_id: groupId,
        resource_name: 'group'
      };
    };
    this.uploader.uploadAll();
  }

  getGroup(id: string): Observable<Model.Group> {
    let url = `${environment.apiUrl}/api/groups/${id}`;
    return this.http.get(url)
      .map((response: Response) => {
        console.log('this is response in the service', response.json);
        const json = response.json();
        if (json && json.data) {
          return new Model.Group(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
}