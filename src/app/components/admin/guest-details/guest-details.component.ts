import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

/**
* @class GuestDetailsComponent
* @author Mncedisi Masondo 
* @description - GuestDetailsComponent handles guest details retrieval and management.
*/
@Component({
  selector: 'app-guest-details',
  imports: [RouterLink,MatProgressSpinnerModule,NgIf],
  templateUrl: './guest-details.component.html',
  styleUrl: './guest-details.component.css'
})
export class GuestDetailsComponent {

  /** @property {any} id - The ID of the guest. */
  id: any
 
  /** @property {any} guestDetails - The details of the guest. */
  guestDetails: any

  /** @property {boolean} isLoading - Indicates if data is being loaded. */
  isLoading: boolean = false

  /** @private @property {inject(MatSnackBar)} _snackbar */
  private snackbar = inject(MatSnackBar)

  /**
  * @constructor
  * @description Initializes the component with necessary services.
  * @param {Router} router - Angular router for navigation.
  * @param {UserService} userService - Service for fetching user details.
  */
  constructor(private router: Router, private userService: UserService) { }

  /**
  * @method ngOnInit
  * @description Lifecycle method that initializes component data.
  */
  ngOnInit() {

    // Get the current navigation object from the router
    const navigation = this.router.getCurrentNavigation()
    // Extract the state object from navigation extras, expecting an 'id' property
    const state = navigation?.extras?.state as { id?: any }

    // Check if 'id' is available in the navigation state
    if (state?.id) {
      // Assign the retrieved ID to the component property
      this.id = state.id
      // Store the ID in sessionStorage to persist across refreshes
      sessionStorage.setItem('id', this.id)
    } else {
      // Retrieve the ID from sessionStorage if the page was refreshed
      this.id = sessionStorage.getItem('id')
    }

    // If 'id' is still not available, redirect to the home page
    if (!this.id) {
      // Redirect user to the home page to prevent access without a valid ID
      this.router.navigate(['/'])
    }

    // Fetch the guest details after retrieving ID
    this.fetchGuestDetails()
  }

  /**
  * @async
  * @method fetchGuestDetails
  * @description Fetches guest details asynchronously and updates the component state.
  * @returns {Promise<void>} - Resolves when guest details are fetched.
  */
  async fetchGuestDetails(): Promise<void> {

    try {

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {
      // Fetch guest details from the service
      this.guestDetails = await this.userService.getGuestById(this.id)
      // Hide spinner after data is loaded
      this.isLoading = false

      }, 1000) // 1-second delay for effect

    } catch (error) {
      // Log any errors encountered during the fetch process
      console.error('Error fetching guests:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
    }
  }

  /**
  * @async
  * @method editGuest
  * @description Edits guest details.
  */
  editGuest() { }

  /**
  * @method removeGuest
  * @description Removes guest from the system.
  */
  removeGuest() { }

}
