import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';
import { Scholarship } from '../_models/scholarship.model';

@Injectable()

export class ResourcesService {
  public selectedApplication: Model.Application;

  constructor(private http: Http) {

  }

  createResource(resource: Model.Resource): Observable<Model.Resource> {
    let url = `${environment.apiUrl}/api/opportunities`;
    return this.http.post(url, resource)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Resource(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  updateResource(resource: Model.Resource): Observable<Model.Resource> {
    let url = `${environment.apiUrl}/api/opportunity/${resource.id}`;
    return this.http.patch(url, resource)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Resource(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getResource(id: string): Observable<Model.Resource> {
    let url = `${environment.apiUrl}/api/opportunity/${id}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Resource(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getResourceApplications(id: string): Observable<Model.Application[]> {
    let url = `${environment.apiUrl}/api/opportunities/${id}/applications`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Application');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getResources(type: string, offset: number, search: string = '', limit: number = 50): Observable<Model.Resource[]> {
    let paramType = type !== '' ? `type=${type}` : '';
    let paramTitle = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/opportunities/admin?offset=${offset}&limit=${limit}&${paramType}&${paramTitle}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Resource');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getScholarships(offset: number, limit: number, search: string = ''): Observable<Model.Scholarship[]> {
    let querySearch = search !== '' ? `&search=${search}` : '';
    let url = `${environment.apiUrl}/api/scholarships/admin?offset=${offset}&limit=${limit}${querySearch}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Scholarship');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }


  getOpportunities(offset: number, limit: number = 0): Observable<Model.Resource[]> {
    let url = `${environment.apiUrl}/api/opportunities?offset=${offset}&limit=${limit}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Resource');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getCareerSize(): Observable<number> {
    let url = `${environment.apiUrl}/api/careers`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.count) {
          return json.count;
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getCareers(size: number = 20): Observable<Model.Career[]> {
    let url = `${environment.apiUrl}/api/careers?limit=${size}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Career');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getOrganizationSize(): Observable<number> {
    let url = `${environment.apiUrl}/api/organization`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.count) {
          return json.count;
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getOrganizations(size: number = 0): Observable<Model.Organization[]> {
    let url = (size === 0) ? `${environment.apiUrl}/api/organization` : `${environment.apiUrl}/api/organization?limit=${size}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Organization');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  createScholarship(scholarship: Model.Scholarship): Observable<Model.Scholarship> {
    let url = `${environment.apiUrl}/api/scholarships`;
    return this.http.post(url, scholarship)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Scholarship(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  updateScholarship(scholarship: Model.Scholarship): Observable<Model.Scholarship> {
    let url = `${environment.apiUrl}/api/scholarships/${scholarship.id}`;
    return this.http.patch(url, scholarship)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Scholarship(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getScholarship(id: string): Observable<Model.Scholarship> {
    let url = `${environment.apiUrl}/api/scholarships/${id}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Scholarship(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  getScholarshipApplications(id: string): Observable<Model.Application[]> {
    let url = `${environment.apiUrl}/api/scholarships/${id}/applications`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Application');
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  scholarshipApprove(id: string): Observable<Model.Scholarship> {
    let url = `${environment.apiUrl}/api/scholarships/${id}/approve`;
    return this.http.patch(url, {})
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Scholarship(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  scholarshipReject(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/scholarships/${id}/reject`;
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

  internshipApprove(id: string): Observable<Model.Resource> {
    let url = `${environment.apiUrl}/api/internships/${id}/approve`;
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
  opportunityApprove(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/opportunities/${id}/approve`;
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

  internshipReject(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/internships/${id}/reject`;
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
  opportunityReject(id: string): Observable<Model.Approval> {
    let url = `${environment.apiUrl}/api/opportunities/${id}/reject`;
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

  setApplication(application: Model.Application): void {
    this.selectedApplication = application;
  }

  getApplication(): Model.Application {
    return this.selectedApplication ? this.selectedApplication : new Model.Application();
  }
}