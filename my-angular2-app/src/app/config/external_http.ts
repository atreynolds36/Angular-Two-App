import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, Headers, ResponseOptions, Response, BrowserXhr , XHRBackend , XHRConnection , XSRFStrategy, Request} from '@angular/http';

@Injectable()
export class ExternalApiXsrfStrategy implements XSRFStrategy{
  constructor(_cookieName?: string, _headerName?: string){}
  configureRequest(req: Request): void{
    //do nothing
    console.log('hitter');
  }
}

@Injectable()
export class ExternalXHRBackend extends XHRBackend {
  constructor(
    _browserXHR: BrowserXhr, _baseResponseOptions: ResponseOptions,
    _xsrfStrategy: XSRFStrategy) {
    super(_browserXHR , _baseResponseOptions , _xsrfStrategy);
  }
}

@Injectable()
export class ExternalHttp extends Http {
  constructor(_backend, _defaultOptions){
    super(_backend , _defaultOptions);
  }
}


