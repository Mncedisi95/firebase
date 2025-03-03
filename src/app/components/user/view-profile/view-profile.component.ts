import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

/**
* Component for displaying and managing guest profile details.
*/

@Component({
  selector: 'app-view-profile',
  imports: [NgIf,RouterLink],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})

export class ViewProfileComponent {
 
    /**
    * Stores the details of the current guest.
    * @property {any} guestDetails
    */
    guestDetails: any
  
    /**
    * Stores the unique ID of the current guest.
    * @property {string | undefined}
    */
    id: any

    /**
    * @property {boolean} isLoggedIn
    */
    isLoggedIn : boolean = false
   
    /**
     * @constructor
     * @description - Constructor for GuestProfileComponent.
     * @param {UserService} userService - Service for fetching guest data.
     * @param {AuthService} authService - Service for managing authentication.
     * @param {Router} router - Angular Router for navigation.
     */
    constructor( private userService: UserService, private authService: AuthService,private router: Router) {}
  
    /**
     * Lifecycle method that initializes the component.
     * Subscribes to the current user's authentication state
     * and fetches guest details based on their ID.
     */
    ngOnInit(): void {

      this.authService.currentUser$.subscribe((user) => {

        if (user && user.uid) {

          this.isLoggedIn = !!user
          this.id = user.uid
          this.fetchGuestDetails()
        }
      })
    }
  
    /**
     * @async
     * @method fetchGuestDetails
     * @description - Fetches the details of the guest based on their ID.
     * @returns {Promise<void>} Resolves once the guest details have been fetched.
     */
    async fetchGuestDetails(): Promise<void> {

      if (!this.id) {
        console.error('Guest ID is undefined. Cannot fetch guest details.');
        return
      }
  
      try {

        this.guestDetails = await this.userService.getGuestById(this.id)

      } catch (error) {
        console.error('Error fetching guest details:', error);
      }
    }
  
    /**
    * @method editProfile
    * @description -Navigates to the edit profile page for the current guest.
    */
    editProfile(): void {

      const id = this.id

      sessionStorage.setItem('id', id)

      this.router.navigate(['/edit-profile'], {state: {id}})
    }
}
  


