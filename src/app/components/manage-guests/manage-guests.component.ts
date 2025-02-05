import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-guests',
  imports: [NgFor,RouterLink,FormsModule,NgIf],
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css'
})
export class ManageGuestsComponent {

  /**
  * @property {any[]} users
  */
  users: any 

  /**
  * @property {any[]} 
  */
  originalUsers : any 

  /**
  * @property {string} selectedRole
  */
  selectedRole: string = ''

  /**
  * @constructor 
  * @description
  * @param {Router} router 
  * @param {UserService} userService
  */
  constructor(
    private router: Router,
    private userService : UserService){}

  /**
  * @method ngOnInit
  */
  ngOnInit() {

    this.fetchUsers()
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
  async fetchUsers() : Promise<void> {

    try {
      // Fetch the list of guests using the UserService
      this.originalUsers = await this.userService.getUsers()

      this.users = this.originalUsers
      
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  /**
  * Filters the list of users based on the selected user role.
  *
  * @async
  * @method onFilterUser
  * @description Fetches users filtered by the selected role from the `UserService` 
  * and updates the `users` list.
  *
  * @returns {Promise<void>} Resolves when the filtered users are retrieved and assigned.
  * @throws {Error} Logs an error if the filtering operation fails.
  */
  async onFilterUser(): Promise<void> {

    try {

      // Check if a valid role is selected
      if (!this.selectedRole || this.selectedRole.trim() === '') {
        console.log('No user role selected for filtering.')
        return
      }

      if (this.selectedRole.toLowerCase() === 'all') {
        // Fetch all users when 'all' is selected
        await this.fetchUsers()
      }
      else {
        // Fetch users filtered by role
        this.users = await this.userService.filterUserByRole(this.selectedRole)
      }

    } catch (error) {
      console.log('Error occurred while filtering users by role:', error)
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

  /**
  * @method goToAddUser
  * @description Navigates to the "Add User" page.
  * Redirects the user to the `/add-user` route.
  */
  goToAddUser(): void {

    this.router.navigate(['/add-user'])
  }
}
