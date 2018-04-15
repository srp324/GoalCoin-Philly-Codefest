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
  result: any;
  dataService: DataService;
  owner = "";
  addresses = "";
  goal = "";
  reward = "";
  winners = "";
  caddress = "";

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) 
  {
    // Access the Data Service's getUsers() method we defined
    this.dataService = _dataService;
  }

  getABI() {
    this._dataService.getABI().subscribe(res => this.result = res);
    console.log("Got ABI!");
    console.log(this.result);
  }

  deployContract() {
    this._dataService.deployContract(this.owner, this.addresses, this.goal, this.reward).subscribe(res => this.result = res);
    console.log("Created contract with owner: " + this.owner);
    console.log(this.result);
  }

  getCAddress() {
    this._dataService.getCAddress().subscribe(res => this.result = res);
    console.log("Got CAddress!");
    console.log(this.result);
  }

  addWinners() {
    this._dataService.addWinners(this.caddress, this.winners).subscribe(res => this.result = res);
    console.log("Added winners!");
    console.log(this.result);
  }

  completeGoal() {
    this._dataService.completeGoal(this.caddress).subscribe(res => this.result = res);
    console.log("Goal Complete! Awarded the winners!");
    console.log(this.result);
  }
}
