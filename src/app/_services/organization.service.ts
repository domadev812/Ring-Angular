import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, RequestOptionsArgs } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import { environment } from '../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()

export class OrganizationService {

  public uploader: FileUploader;

  constructor(private http: Http, ) {
    const URL = `${environment.apiUrl}/api/assets/upload`;
    this.uploader = new FileUploader({ url: URL, itemAlias: 'files', removeAfterUpload: true, method: 'POST' });
  }

  createOrganization(organization: Model.Organization): Observable<Model.Organization> {
    let url = `${environment.apiUrl}/api/organization`;
    return this.http.post(url, organization)
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.Organization(json);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }
  createUserOrganization(organization: Model.Organization, user: Model.User): Observable<Model.User> {
    let url = `${environment.apiUrl}/api/users/community`;
    return this.http.post(url, { organization, user })
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.User(json);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  updateOrganization(organization: Model.Organization): Observable<Model.Organization> {
    let url = `${environment.apiUrl}/api/organization/${organization.id}`;
    return this.http.patch(url, organization)
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.Organization(json);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

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
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }

  getOrganization(organization_id: string): Observable<Model.Organization> {
    let url = `${environment.apiUrl}/api/organization/${organization_id}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json) {
          return new Model.Organization(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  deleteOrganization(id: string): Observable<Model.Organization> {
    let url = `${environment.apiUrl}/api/organization/${id}/remove`;
    return this.http.delete(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Organization(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  createOrganizationUrl(): string {
    let url = '/organization?';

    let i;
    return url;
  }

  // need a model Groups for type Observable<Model.Groups[]>
  getSchoolGroups(type: string, offset: number, limit: number = 50, search: string = ''): Observable<Model.Organization[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/groups?offset=${offset}&limit=${limit}&${paramType}&${paramSearch}`;
    return this.http.get(url)
      .map((res: Response) => {
        const json = res.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Organization');
        } else {
          Observable.throw({ message: 'Internal Server Error', res });
        }
      });
  }

  uploadImage(organizationId: string): void {
    let token = localStorage.getItem('Token');
    this.uploader.onBeforeUploadItem = (item: any) => {
      item.withCredentials = false;
      this.uploader.authToken = 'Bearer ' + token;
      this.uploader.options.additionalParameter = {
        resource_id: organizationId,
        resource_name: 'organization'
      };
    };
    this.uploader.uploadAll();
  }



  sendData(data: Object): Observable<boolean> {
    return this.http
      .post('https://script.google.com/macros/s/AKfycbzkhkLQRc7e62eyHz1F-8TN8dzFTV4bbP3G6dFDphZh7-W32IM/exec', data, null)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.result === 'success') {
          return true;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

}