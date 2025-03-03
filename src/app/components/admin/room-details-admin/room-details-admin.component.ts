import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomService } from '../../../services/room.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-room-details-admin',
  imports: [NgIf, RouterLink, MatProgressSpinnerModule],
  templateUrl: './room-details-admin.component.html',
  styleUrl: './room-details-admin.component.css'
})
export class RoomDetailsAdminComponent {

  /**
  * @property {any} id
  */
  id: any

  /**
  * @property {any} roomDetails
  */
  roomDetails: any

  /**
  * Represents the current success message to display.
  * @property {string} successMessage
  */
  successMessage: string = ''

  /**
  * Controls visibility of success messages.
  * @property {boolean} isSuccessVisible
  */
  isSuccessVisible: boolean = false

  /**
  *  Represents the current error message to display.
  * @property {string} errorMessage 
  */
  errorMessage: string = ''

  /**
  * @property {boolean} isErrorVisible
  * Represents whether to display an error message on the book page. Set to true to show the 
  * error message and false to hide it.
  * Default value: false.
  */
  isErrorVisible: boolean = false

  /**  @property {boolean} isLoading */
  isLoading: boolean = false

  /** @property {string} userRole */
  userRole: string = ''

  /** @private @property {inject(MatSnackBar)} _snackbar */
  private snackbar = inject(MatSnackBar)

  /**
   * @constructor
   * @description
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {RoomService} roomService 
   */
  constructor(private router: Router, private roomService: RoomService, private authService: AuthService) { }

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

    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe((user) => {

      if (user) {
        // If a user exists, retrieve their role
        this.setUserRole()
      }
    })

    // Fetch room details using the ID
    this.fetchRoomDetails()
  }

  /**
  * @async
  * @method setUserRole
  * @description Retrieves and sets the user role asynchronously.
  * @returns {Promise<void>} Resolves when the user role have been successfully fetched and stored. 
  */
  private async setUserRole(): Promise<void> {
    try {
      // Fetch user role from the authentication service
      this.userRole = await this.authService.hasRole()
    } catch (error) {
      // Log any errors encountered while retrieving the role
      console.error('Error fetching user role:', error);
    }
  }

  /**
 * @method showError 
 * @description Displays an error message for a specified duration.
 * @param {string} message - The error message to be displayed. 
 * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
 */
  showError(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.isErrorVisible) return;

    // Set the error message and display state
    this.errorMessage = message
    this.isErrorVisible = true

    setTimeout(() => {
      this.isErrorVisible = false
      this.errorMessage = ''
    }, duration)
  }

  /**
 * @method showSuccess
 * @description Displays a success message for a specified duration. 
 * @param {string} message - The success message to be displayed.
 * @param {number} [duration= 3000] - Optional duration for the error message display in milliseconds.
 */
  showSuccess(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.isSuccessVisible) return

    // Set the error message and display state
    this.successMessage = message
    this.isSuccessVisible = true

    setTimeout(() => {
      this.isSuccessVisible = false
      this.successMessage = ''
    }, duration);
  }

  /**
  * Fetches the details of a specific room by its ID.
  * @async
  * @method fetchRoomDetails
  * @description Retrieves room details from the RoomService using the room's unique ID.
  * If an error occurs, it logs the error and provides appropriate feedback.
  * @returns {Promise<void>} A promise that resolves when the room details are successfully fetched.
  */
  async fetchRoomDetails(): Promise<void> {

    try {

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {
        // Attempt to fetch room details from the RoomService
        this.roomDetails = await this.roomService.getRoomById(this.id)
        // Hide spinner
        this.isLoading = false
      }, 1000) // 1-second delay for effect

    } catch (error) {

      // Log the error in the console
      console.log('Error fetching room details:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
    }
  }

  /**
  * Handles the room deletion process by invoking the `deleteRoom` method 
  * from the room service. Displays success or error messages based on the outcome.
  * 
  * @async
  * @method onDeleteRoom
  * @returns {Promise<void>} Resolves when the room is successfully deleted or logs an error if deletion fails.
  * 
  * @description
  * This method interacts with the `roomService` to delete a room by its ID (`this.id`).
  * Upon successful deletion, it displays a success message and logs the event.
  * In case of an error, it shows an error message and logs the error for debugging.
  */
  async onDeteteRoom(): Promise<void> {

    if (!this.id) {
      console.log('Room ID is undefined or null. Deletion cannot proceed.');
      this.showError('Invalid room ID. Deletion aborted.');
      return;
    }

    try {

      const confirmDelete = this.snackbar.open('Are you sure you want to delete this room?', 'Yes')

      if (confirmDelete) {

        // Attempt to delete the room using the room service
        await this.roomService.deleteRoom(this.id)

        // Show success message and log the event
        this.showSuccess('Room deletion successful!')

        // Navigate to the rooms page after a short delay
        setTimeout(() => {
          this.router.navigate(['/rooms-admin'])
        }, 3500)
      }

    } catch (error) {

      // Show error message and log the error for debugging
      this.showError('Error occurred while deleting room')
      console.log('Error occurred while deleting room:', error)
    }
  }

  /**
  * @method goToEditRoom
  * @description 
  */
  goToEditRoom(): void {

    if (!this.id) {

      this.showError('Invalid room ID. Navigation to edit aborted.')
      return
    }

    try {

      sessionStorage.setItem('id', this.id)

      const id = this.id

      // navigate to edit room component
      this.router.navigate(['/edit-room'], { state: { id } })

    } catch (error) {

      console.log('Error occurred while navigating to edit room page:', error)
    }
  }

 /**
 * @function generateStars
 * @description Converts a numeric rating into a star string.
 * @param {number} rating - The rating (1-5).
 * @returns {string}
 */
  generateStars(rating: number): string {
    return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  }

}
