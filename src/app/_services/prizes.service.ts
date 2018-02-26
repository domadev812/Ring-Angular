import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';

@Injectable()
export class PrizesService {

  constructor(private http: Http) { }

  getPrizes(offset: number, search: string = '', limit: number = 50): Observable<Model.Prize[]> {    
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/prizes?offset=${offset}&limit=${limit}&${paramSearch}`;    
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Prize');
        } else {
          Observable.throw({message: 'Internal Server Error', response});
        }
      });
  }


  activateCardNumber(cardNumber: string): Observable<boolean> {
    let url = environment.apiUrl + '/api/keycard/' + cardNumber + '/activate';        
    return this.http.patch(url, {})
    .map((response: Response) => {
      const json = response.json();
      if (json && json.data) {
        return true;
      } else {
        Observable.throw({ messages: 'Internal Server Error', response });
      }
    });
  }

  createPrize(prize: Model.Prize): Observable<Model.Prize> {
    let url = `${environment.apiUrl}/api/prizes`;       
    return this.http.post(url, prize)
    .map((response: Response) => {
      const json = response.json();      
      if (json && json.data) {
        return new Model.Prize(json.data);
      } else {
        Observable.throw({ messages: 'Internal Server Error', response });
      }
    });
  }

  getPrize(prizeId: string): Observable<Model.Prize> {
    let url = `${environment.apiUrl}/api/prizes/${prizeId}`;           
    return this.http.get(url)
    .map((response: Response) => {      
      const json = response.json();
      if (json && json.data) {
        return new Model.Prize(json.data);
      } else {
        Observable.throw({ messages: 'Internal Server Error', response });
      }
    });
  }

  updatePrize(prize: Model.Prize): Observable<boolean> {
    let url = `${environment.apiUrl}/api/prizes`;             
    return this.http.post(url, prize)
    .map((response: Response) => {
      const json = response.json();
      if (json && json.data) {
        return true;
      } else {
        Observable.throw({ messages: 'Internal Server Error', response });
      }
    });
  }
  
  createCampaign(prizeId: string, campaign: Model.Campaign): Observable<Model.Campaign> {
    let url = `${environment.apiUrl}/api/prizes/${prizeId}/campaign`;      
    return this.http.post(url, campaign)
    .map((response: Response) => {
      const json = response.json();      
      if (json && json.data) {
        console.log(json.data);
        return new Model.Campaign(json.data);
      } else {
        Observable.throw({ messages: 'Internal Server Error', response });
      }
    });
  }
}
