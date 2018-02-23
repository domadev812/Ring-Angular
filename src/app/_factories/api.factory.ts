import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { Api } from '../_providers/api.provider';

export function apiFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Api {
  return new Api(xhrBackend, requestOptions);
}
