import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { DataService } from '../../../services/data.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink,NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {


  /** @property {boolean} isLoggedIn */

  isLoggedIn: boolean = false

  /** @property {boolean} isAdminOrStaff */

  isAdminOrStaff: boolean = false

  /** @property {any} id */

  id: any

  /** @property {string} userRole */

  userRole: string = ''

  /**  @property {any} guestDetails */

  guestDetails: any

  /** @property {any} data */

  data: any

  /**
  * @constructor
  * @param {AuthService} authService
  * @param {UserService} userService
  * @param {DataService} dataService
  */
  constructor(private authService: AuthService, private userService: UserService, private dataService: DataService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {

      if (user) {

        this.id = user.uid

        this.fetchGuestDetails()

        // Check if user has admin role
        this.authService.hasRole().then(role => {

          // Fetch the user role from your authentication service or session storage
          this.isAdminOrStaff = role === 'admin' || role === 'staff'
        })
      }
      else {
        this.isAdminOrStaff = false;
      }
    })
    // Subscribe to the readData() method to fetch data from the service
    this.dataService.readData().subscribe({
      next: (data) => {
        this.data = data // Assign fetched data to the component's variable
      },
      error: (error) => {
        console.error('Error fetching data:', error) // Log error to console
      }
    })
  }

  /**
 * @async
 * @method fetchGuestDetails
 * @description Fetches guest details from the database based on the provided guest ID. 
 *              Logs an error if the ID is missing or the request fails.
 * @returns {Promise<void>} Resolves when guest details are fetched and assigned successfully.
 */
  async fetchGuestDetails(): Promise<void> {

    if (!this.id) {
      console.error('Guest ID is undefined. Cannot fetch guest details.');
      return
    }

    try {

      // Fetch guest details from the service
      this.guestDetails = await this.userService.getGuestById(this.id)

    } catch (error) {
      // Handle potential errors gracefully
      console.log('Error fetching guest details:', error);
    }
  }

}
