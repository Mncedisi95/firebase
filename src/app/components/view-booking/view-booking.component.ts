import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgFor, NgIf } from '@angular/common';
import { SortByDatePipe } from '../../sort-by-date.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-booking',
  imports: [RouterLink, NgFor, SortByDatePipe, NgIf],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css'
})
export class ViewBookingComponent {

  /**
  * @property {any} guestId
  */
  guestId: any

  /**
  * @property {any} roomId 
  */
  roomId: any

  /**
  * @property {any[]} bookings
  */
  bookings: any[] = []

  /**
  * @property {string} today
  */
  today: any

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
  * @property {any} currentBookingId
  */
  currentBookingId: string | null = null

  /**
  * @constructor
  * @description 
  * @param router 
  */
  constructor(
    private router: Router, 
    private roomService: RoomService, 
    private authService: AuthService
  ) { }

  ngOnInit() {

    // Initialize today's date in YYYY-MM-DD format
    const now = new Date();
    this.today = now.toISOString().split('T')[0]

    this.authService.currentUser$.subscribe((user) => {
      this.guestId = user.uid
    })

    this.fetchGuestBookings()
  }

  /**
  * Fetches and enriches the guest's bookings with room details.
  *
  * @async
  * @method fetchGuestBookings
  * @description Fetches all bookings for the specified guest, enriches each booking with 
  *              its associated room details, and logs the results for debugging purposes.
  * @returns {Promise<void>} A promise that resolves when all bookings have been fetched and enriched.
  */
  async fetchGuestBookings(): Promise<void> {

    try {

      // Step 1: Fetch bookings by guest ID
      this.bookings = await this.roomService.getBookingsByGuestId(this.guestId)
     
      // Step 2: Enrich each booking with room details
      this.bookings = await Promise.all(this.bookings.map(async (booking) => {

        this.roomId = booking.roomId

        // Validate that roomId exists before attempting to fetch room details
        if (!this.roomId) {
          console.log(`Booking ${booking.id} does not have a valid roomId.`);
          return { ...booking, room: null };
        }

        // Fetch room details by ID
        const roomDetails = await this.roomService.getRoomById(this.roomId)

        // Return the enriched booking object
        return { ...booking, room: roomDetails }
      }))

    } catch (error) {

      // Handle and log errors during booking fetch
      console.log('Error fetching bookings details:', error);
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
   * @async
   * @method onCheckIn
   * @description Handles the check-in process by updating the room status and check-in status.
   * It calls the `checkIn` method from the room service to mark the booking as checked in.
   * 
   * @param {string} id - The ID of the booking or room being checked in.
   * @returns {Promise<void>} - A promise that resolves when the check-in operation is complete.
   * @throws {Error} - Throws an error if the check-in operation fails.
   */
  async onCheckIn(id: string): Promise<void> {

    // Track the active booking
    this.currentBookingId = id

    try {

      // Prepare the data to update the booking or room status
      const updatedData = {
        hasCheckedIn: true,  // Mark the user as checked in
        status: 'Check-In'   // Update the status to 'Check-In'
      }

      // Call the checkIn method to update the data in Firestore
      await this.roomService.checkIn(id, updatedData)

      // Log success message for debugging or user feedback
      this.showSuccess('Check-In Successful! Welcome to SuiteSync!')

    } catch (error) {
      // Log the error and provide feedback for debugging
      this.showError('Error during check-in process')
      // Optionally, you can throw or handle the error further depending on your needs
      throw new Error('Failed to complete check-in process. Please try again later.')
    }  
  }

  /**
 * @async
 * @method onCheckOut
 * @description Handles the check-out process for a booking, updating the booking status and related data in the database.
 * @param {string} bookingId - The unique identifier of the booking to check out.
 * @returns {Promise<void>}
 */
  async onCheckOut(bookingId: string): Promise<void> {

    // Track the active booking
    this.currentBookingId = bookingId

    try {
      // Prepare the updated data for check-out
      const updatedData = {
        hasCheckedIn: false,  // Mark the guest as not checked in
        hasCheckedOut: true, // Mark the guest as checked out
        status: 'Checked-Out' // Update the status to reflect the check-out
      };

      // Update the booking in the database using the room service
      await this.roomService.checkOut(bookingId, updatedData)

      // Provide feedback to the user upon successful check-out
      this.showSuccess('Thank you for staying at SuiteSync. Your check-out is complete!')

      // Navigate to the rooms page after a short delay
      setTimeout(() => {

        const id = this.roomId

        sessionStorage.setItem('id', id)

        this.router.navigate(['/leave-review'], {state: {id}})
      }, 3500)

    } catch (error) {
      // Log the error and provide feedback to the user in case of failure
      this.showError('Error during check Out')
      throw error
    } 
  }

  /**
  * Handles the cancellation of a booking by updating its status and displaying appropriate feedback.
  *
  * @async
  * @method onCancelBooking
  * @param {string} bookingId - The ID of the booking to be canceled.
  * @returns {Promise<void>} Resolves when the booking cancellation is successfully processed.
  * @throws {Error} Displays an error message if the cancellation process fails.
  */
  async onCancelBooking(bookingId: any): Promise<void> {

    // Set the current booking ID to track the booking being canceled
    this.currentBookingId = bookingId

    try {

      // Update the booking status to 'Cancelled'
      await this.roomService.updateBookingStatus(bookingId,'Cancelled')
      console.log('Booking and room status updated successfully!')

      // Display success feedback to the user
      this.showSuccess('Booking cancelled successfully!')

    } catch (error) {
      // Display error feedback to the user
      this.showError('Booking cancellation failed. Please try again.')
    }
  }

}
