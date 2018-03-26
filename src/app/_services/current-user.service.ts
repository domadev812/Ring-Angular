import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Model } from '../../app/app.models-list';
import { tokenNotExpired } from 'angular2-jwt';
import { Http, Response } from '@angular/http';
import { AuthService } from '../_services/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrentUserService {
  public currentUser: Model.User;
  private currentUserPromise: Promise<Model.User>;
  private notify = new Subject<any>();

  token: string = undefined;
  jwtHelper: JwtHelper = new JwtHelper();

  notifyObservable$ = this.notify.asObservable();
  currentUserEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http?: Http) {
    this.http = http;
  }

  public authenticated() {
    return tokenNotExpired('Token');
  }


  load(user): void {
    if (this.currentUser === undefined || this.token === undefined) {
      this.token = window.localStorage.getItem('Token');
      if (user) {
        this.currentUser = user;
        this.emitUpdate();
      }
    }
    if (
      !this.token
      || this.currentUser === undefined
      || this.currentUser.roles === undefined
    ) {
      this.destroy();
    }
  }

  // stores the promise it receives as a new variable
  getCurrentUser(authProvider: AuthService, force: boolean = false): Promise<Model.User> {
    let token = localStorage.getItem('Token');   
    if (!this.currentUserPromise || force) {
      this.currentUserPromise = new Promise((resolve, reject) => {
        if (this.currentUser && !force) {
          resolve(this.currentUser);
        }
        // tslint:disable-next-line:one-line
        else if (token) {
          let decodedToken = this.jwtHelper.decodeToken(token);
          let userId = decodedToken.id;
          authProvider.getUser().subscribe((user: Model.User) => {
            this.load(user);
            if (user) {
              this.currentUser = user;
              this.emitUpdate();
              resolve(user);
            } else {
              reject();
            }
          }, (err) => {
            reject(err);
          });
        } else {
          reject('User not logged in');
        }
      });
    }
    return this.currentUserPromise;
  }

  // On login, we have to clear current user promise after it returns "user is not logged in". 
  // That way, it doesn't always return this after a successfull login
  clearCurrentUserPromise(): void {
    this.currentUserPromise = null;
  }

  hasCurrentUser(): boolean {
    return this.currentUser !== null;
  }

  set(token: string, user: API.IUser): boolean {
    window.localStorage.setItem('Token', token);
    let parsedUser = new Model.User(user);    
    this.load(parsedUser);
    this.currentUserChange();
    return this.authenticated();
  }

  destroy(): void {
    window.localStorage.clear();
    this.currentUser = undefined;
    this.token = null;
    this.currentUserPromise = undefined;
  }

  updateUser(params: Model.User, id: string): Observable<Model.User> {
    return this.http.patch('/users/' + id, params)
      .map((response: Response) => {
        const json = response.json();

        if (json && json.data) {
          this.currentUser = new Model.User(json.data);
          return new Model.User(json.data);
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }

  public emitUpdate() {
    this.notify.next(this.currentUser);
  }

  currentUserChange(): void {
    this.currentUserEvent.emit(this.currentUser);
  }
}