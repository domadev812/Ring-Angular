import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { CurrentUserService } from '../app.services-list';

@Injectable()
export class Api extends Http {
  private currentUserService: CurrentUserService = new CurrentUserService;

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
  ) {
    super(backend, defaultOptions);
  }

  get(path: string, options: RequestOptionsArgs = new RequestOptions()): Observable<Response> {
    return super
      .get(this.apiUrl(path), this.getRequestOptionWithHeaders(options))
      .catch(this.formatErrorResponse);
  }

  post(path: string, body: any, options: RequestOptionsArgs = new RequestOptions()): Observable<Response> {
    return super
      .post(this.apiUrl(path), JSON.stringify(body), this.getRequestOptionWithHeaders(options))
      .catch(this.formatErrorResponse);
  }

  patch(path: string, body: any, options: RequestOptionsArgs = new RequestOptions()): Observable<Response> {
    return super
      .patch(this.apiUrl(path), JSON.stringify(body), this.getRequestOptionWithHeaders(options))
      .catch(this.formatErrorResponse);
  }

  delete(path: string, options: RequestOptionsArgs = new RequestOptions()): Observable<Response> {
    return super
      .delete(this.apiUrl(path), this.getRequestOptionWithHeaders(options))
      .catch(this.formatErrorResponse);
  }

  private apiUrl(path: string | Request): string {
    if (typeof (path) === 'string') {
      if (path.substring(0, 4) === 'http') {
        return path;
      } else {
        return `${environment.apiUrl}/api${path}`;
      }
    } else {
      return `${environment.apiUrl}/api${path.url}`;
    }
  }

  private getRequestOptionWithHeaders(options: RequestOptionsArgs): RequestOptionsArgs {
    if (!options.headers) {
      options.headers = new Headers();
    }

    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Accept', 'application/json');

    if (this.currentUserService.authenticated()) {
      let token = localStorage.getItem('Token');      
      options.headers.append('Authorization', `Bearer ${token}`);
    }

    //Just for testing, use above code once user login is set up
    // tslint:disable-next-line:max-line-length
    //  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl0sImlhdCI6MTUxNzg2MzgwNCwiZXhwIjoxNTI4MjMxODA0fQ.3NS9iBsLgqusCaX3K1zG2Qbpfs8W6A-eqnBYTgfQo0w';
    //  options.headers.append('Authorization', `Bearer ${token}`);

    return options;
  }

  private formatErrorResponse(response: Response): Observable<any> {
    try {
      return Observable.throw(response.json());
    } catch (_error) {
      return Observable.throw({ message: response.statusText });
    }
  }
}
