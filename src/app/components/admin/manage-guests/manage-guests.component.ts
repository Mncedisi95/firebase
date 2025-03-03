import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-manage-guests',
  imports: [NgFor,RouterLink,FormsModule,NgIf,MatProgressSpinnerModule,MatPaginator,SlicePipe],
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css'
})
export class ManageGuestsComponent {

  /**
  * @property {any[]} users
  */
  users: any[] = [] 

  /**
  * @property {any[]} 
  */
  originalUsers : any 

  /**
  * Represents the total number of users available.
  * @property {number} items - Total count of users.
  */
  items: number = 0

  /**
  * Represents the current page index in the pagination.
  * @property {number} currentpage - Zero-based index of the current page.
  */
  currentpage: number = 0
 
  /**
  * Represents the index of the first user displayed on the current page.
  * @property {number} lowIndex - Starting index for pagination.
  */
  lowIndex: number = 0
 
  /**
  * Represents the index of the last user displayed on the current page.
  * @property {number} highIndex - Ending index for pagination.
  */
  highIndex: number = 10

  /**
  * @property {string} selectedRole
  */
  selectedRole: string = ''

  /**
  * @property {boolean} isLoading
  */
  isLoading : boolean = false

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

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {

        // Fetch the list of guests using the UserService
        this.originalUsers = await this.userService.getUsers()
        this.users = this.originalUsers

        // Update total room count
        this.items = this.users.length
        // Hide spinner
        this.isLoading = false
        
      }, 1000)  // 1-second delay for effect

    } catch (error) {

      console.error('Error fetching guests:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
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
        // Set loading state to true before starting the fetch process
        this.isLoading = true

        setTimeout( async () => {

          // Fetch users filtered by role
          this.users = await this.userService.filterUserByRole(this.selectedRole)

          // Hide spinner
          this.isLoading = false
          
        }, 1000)  // 1-second delay for effect 
      }

    } catch (error) {
      console.log('Error occurred while filtering users by role:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
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
  
  /**
  * @method handlePagenator
  * @description Helper function to handle pagination events and update the visible data range based on the current page and page size.
  * 
  * @param {PageEvent} event - The pagination event containing details such as the current page index and page size.
  * @returns {PageEvent} - The same pagination event for further handling or reference.
  * 
  * Functionality:
  * - Updates the lowIndex to reflect the start index of the current page.
  * - Updates the highIndex to reflect the end index of the current page.
  */
  handlePagenator(event: PageEvent): PageEvent {
    // initialize lowindex and high index property
    this.lowIndex = event.pageIndex * event.pageSize
    this.highIndex = this.lowIndex + event.pageSize
    return event
  }
}
