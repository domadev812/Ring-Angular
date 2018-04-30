import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Model } from '../app.models-list';
import 'rxjs/add/operator/map';

@Injectable()
export class PrizesService {

  constructor(
    private http: Http
  ) { }

  getPrizes(offset: number, search: string = '', limit: number = 50): Observable<Model.Prize[]> {
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/prizes?offset=${offset}&limit=${limit}&${paramSearch}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'Prize');
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }

  getAwardedPrizes(offset: number, search: string = '', limit: number = 50): Observable<Model.AwardedPrize[]> {
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/prizes/awarded?offset=${offset}&limit=${limit}&${paramSearch}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'AwardedPrize');
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }

  getKeyCards(offset: number, search: string = '', limit: number = 50): Observable<Model.Prize[]> {
    let paramSearch = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/keycard?offset=${offset}&limit=${limit}&${paramSearch}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'KeyCard');
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
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
          return new Model.Campaign(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  updateCampaign(prizeId: string, campaignId: number, quantity: string) {
    let url = `${environment.apiUrl}/api/prizes/${prizeId}/campaign/${campaignId}`;
    return this.http.patch(url, { qty: quantity })
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return new Model.Campaign(json.data);
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  deleteCampaign(prizeId: string, campaignId: number) {
    let url = `${environment.apiUrl}/api/prizes/${prizeId}/campaign/${campaignId}`;
    return this.http.delete(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return true;
        } else {
          Observable.throw({ messages: 'Internal Server Error', response });
        }
      });
  }

  saveData(data, fileName) {
    let a = document.createElement('a');
    document.body.appendChild(a);
    let json = data._body;
    let blob = new Blob([json], { type: data.headers.get('Content-Type') });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportCSV(loginForm: any): any {
    let format = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    let data = loginForm.startDate ?
      '?start=' + loginForm.startDate.toLocaleDateString('en-US', format) +
      '&end=' + loginForm.endDate.toLocaleDateString('en-US', format) : '';

    let url = `${environment.apiUrl}/api/prizes/export${data}`;

    return this.http.get(url)
      .map((response: Response) => {
        this.saveData(response, 'Export.csv');
      });
  }

  getKeycardIndex(offset: number, limit: number = 50, search: string = ''):
    Observable<Model.KeycardRecipient[]> {
    let paramTitle = search !== '' ? `search=${search}` : '';
    let url = `${environment.apiUrl}/api/keycard?offset=${offset}&limit=${limit}&${paramTitle}`;
    return this.http.get(url)
      .map((response: Response) => {
        const json = response.json();
        if (json && json.data) {
          return Model.initializeArray(json.data, 'KeycardRecipient');
        } else {
          Observable.throw({ message: 'Internal Server Error', response });
        }
      });
  }
}