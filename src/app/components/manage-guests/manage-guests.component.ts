import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-manage-guests',
  imports: [NgFor],
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css'
})
export class ManageGuestsComponent {

  /**
  * @property {any[]} guests 
  */
  guests: any 

  /**
  * @constructor 
  * @description
  * @param {Router} router 
  * @param {UserService} userService
  */
  constructor(private router: Router,private userService : UserService){}

  /**
  * @method ngOnInit
  */
  ngOnInit() {

    this.fetchGuests()
  }

  /**
  * Fetches the list of guests and updates the `guests` property.
  *
  * @async
  * @method fetchGuests
  * @description Calls the `getGuests` method from the `UserService` to retrieve all guest users and stores them in the `guests` property.
  *              If an error occurs during the process, it logs the error and provides a user-friendly error message.
  *
  * @returns {Promise<void>} Resolves when the guests are successfully fetched and updated.
  */
  async fetchGuests() : Promise<void> {

    try {
      // Fetch the list of guests using the UserService
      this.guests = await this.userService.getGuests()
      
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  /**
  * Navigates to the guest details page for the specified guest ID.
  *
  * @method goToGuestDetails
  * @param {any} id - The ID of the guest whose details need to be viewed.
  * @description This method uses the Angular Router to navigate to the `guest-details` route, appending the provided guest ID as a parameter.
  */
  goToGuestDetails(id:any){
    
    sessionStorage.setItem('id', id)

    this.router.navigate(['/guest-details'],{state: {id}})
  }
}
