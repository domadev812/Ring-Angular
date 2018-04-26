import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { CurrentUserService } from '../_services/current-user.service';
import { Model } from '../../app/app.models-list';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  public redirectUrl: string;

  constructor(
    private currentUserService: CurrentUserService,
    private http: Http,
    private router: Router,
  ) { }

  public authenticated() {
    return tokenNotExpired('Token');
  }

  login(loginForm: JSON): Observable<boolean> {
    return this.http.post('/auth', loginForm).map((response: Response) => {
      const json = response.json() as API.Response.Auth;
      if (json.token && json.user) {        
        return this.currentUserService.set(json.token, json.user);
      } else {
        Observable.throw({ message: 'Internal Server Error' });
      }
    });
  }

  logout() {
    this.currentUserService.destroy();
    this.router.navigate(['/login']);
  }

  getUser(): Observable<Model.User> {
    return this.http.get('/users/me')
      .map((response: Response) => {
        const user = new Model.User(response.json().data);
        if (user.email) {
          return user;
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }

  signup(body: Model.User, captcha: string): Observable<boolean> {
    return this.http.post('/users', body)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.auth_token) {
          return this.currentUserService.set(json.auth_token, json);
        } else {
          Observable.throw({ message: 'Internal Server Error' });
        }
      });
  }
}