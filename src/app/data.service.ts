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

  getUsers(caddress) {
    return this._http.get("/api/getUsers/" + caddress).map(result => this.result = result.json().data);
  }

  getCAddress() {
    return this._http.get("/api/getContract").map(result => this.result = result.json().data);
  }

  addWinners(caddress, winners) {
    return this._http.get("/api/addWinners/" + caddress + "-" + winners).map(result => this.result = result.json().data);
  }

  completeGoal(caddress) {
    return this._http.get("/api/completeGoal/" + caddress).map(result => this.result = result.json().data);
  }

}