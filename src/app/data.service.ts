import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getABI() {
    return this._http.get("/api/getABI2").map(result => this.result = result.json().data);
  }

  deployContract(owner, addresses, goal, reward) {
    return this._http.get("/api/deployContract/" + owner + "-" + addresses + "-" + reward).map(result => this.result = result.json().data);
  }

}