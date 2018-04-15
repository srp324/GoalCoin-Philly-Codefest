import { Component } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Define a users property to hold our user data
  //users: Array<any>;
  users: any;
  dataService: DataService;
  owner = "";
  addresses = "";
  goal = "";
  reward = "";

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) 
  {
    // Access the Data Service's getUsers() method we defined
    this.dataService = _dataService;
  }

  getABI() {
    this._dataService.getABI().subscribe(res => this.users = res);
    console.log("Got ABI!");
    console.log(this.users);
  }
}
