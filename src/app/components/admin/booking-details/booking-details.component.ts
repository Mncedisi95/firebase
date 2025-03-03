import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../services/room.service';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-booking-details',
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {

  /**
  * @property {any} id
  */
  id: any

  /**
  * @property {any} bookingDetails
  */
  bookingDetails: any = null

  /** 
  * @property {any} roomDetails 
  */
  roomDetails: any = null

  /**
   * @property {any} guestDetails
   */
  guestDetails: any = null

  /**
   * @property {any} paymentDetails
   */
  paymentDetails: any = null

  /**
  * @property {string} status
  */
  status: string = ''

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
  * @constructor 
  * @param {ActivatedRoute} route
  * @param {RoomService} roomSevice
  * @param {PaymentService} paymentService
  */
  constructor(
    private router: Router,
    private roomService: RoomService,
    private userService: UserService,
    private paymentService: PaymentService
  ) { }

  /**
  * @description 
  */
  async ngOnInit(): Promise<void> {

    try {

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

      await this.fetchCompleteBookingDetails()

    } catch (error) {

      console.error('Error during initialization:', error)
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
   * @method fetchCompleteBookingDetails
   * @description Fetches and combines booking, room, guest, and payment details based on the booking ID.
   * Executes calls in parallel using `Promise.all` for better performance.
   * @returns {Promise<void>}
   */
  async fetchCompleteBookingDetails(): Promise<void> {
    try {
      // Fetch booking details
      this.bookingDetails = await this.roomService.getBookingById(this.id)

      if (!this.bookingDetails) {
        console.error('No booking details found for the provided ID.')
        return
      }

      const roomId = this.bookingDetails?.roomId;
      const guestId = this.bookingDetails?.userId;
      const bookingId = this.bookingDetails?.id;

      // Use Promise.all to fetch room, guest, and payment details in parallel
      const [roomDetails, guestDetails, paymentDetails] = await Promise.all([
        roomId ? this.roomService.getRoomById(roomId) : Promise.resolve(null),
        guestId ? this.userService.getGuestById(guestId) : Promise.resolve(null),
        bookingId ? this.paymentService.getPaymentByBookingId(bookingId) : Promise.resolve(null),
      ]);

      this.roomDetails = roomDetails;
      this.guestDetails = guestDetails;
      this.paymentDetails = paymentDetails;

    } catch (error) {
      console.error('Error fetching complete booking details:', error);
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
  async onUpdateBooking(bookingId: any): Promise<void> {

    try {

      // Update the booking status to 'Cancelled'
      await this.roomService.updateBookingStatus(bookingId, this.status)
      console.log('Booking and room status updated successfully!')

      // Display success feedback to the user
      this.showSuccess('Booking status updated successfully!')

    } catch (error) {
      // Display error feedback to the user
      this.showError('Booking cancellation failed. Please try again.')
    }
  }

}
