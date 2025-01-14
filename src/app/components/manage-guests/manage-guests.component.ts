import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-guests',
  imports: [],
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css'
})
export class ManageGuestsComponent {


  /**
  * @constructor 
  * @description
  * @param {Router} router 
  */
  constructor(private router: Router){}

  /**
  * @method goToGuestDetails
  * @description 
  */
  goToGuestDetails(){
    
    this.router.navigate(['/guest-details'])
  }
}
