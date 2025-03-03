import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-payment',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  /**
  * @property {any} bookingDetails
  */
  bookingDetails: any = {}

  /**
  * @property {any} roomDetails
  */
  roomDetails: any = {}

  /**
  * @property {FormBuilder} paymentForm
  */
  paymentForm: FormGroup

  /**
  * @property {boolean} paymentStatus
  */
  paymentSuccess: boolean = false

  /**
  * @property {boolean} paymentError
  */
  paymentError: boolean = false

  /**
  *  Represents the current error message to display.
  * @property {string} errorMessage 
  */
  errorMessage: string = ''

  /**
  * Represents the current success message to display.
  * @property {string} successMessage
  */
  successMessage: string = ''

  /**
  * @property {any} bookingId
  */
  id: any

  /**
  * @property {number} totalPrice
  */
  totalPrice: number = 0

  /**
   * @property {number} nights 
   */
  nights: any

  /**
  * @constructor
  * @description
  * @param {FormBuilder} formBuilder
  * @param {ActivatedRoute} route
  * @param {RoomService} roomService 
  */
  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService, 
    private router: Router
  ) {

    // Initialize the book room form with validation rules
    this.paymentForm = this.formBuilder.group({
      // Card Holder: Required
      cardHolder: ['', Validators.required],
      // Card Number: Required
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      // Expiry Date: Required
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      // CVV : Required
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    })
  }

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

      // Fetch booking details
      await this.fetchBookingDetails();

      // Ensure roomId is available
      const roomId = this.bookingDetails?.roomId;
      if (roomId) {
        await this.fetchRoomDetails(roomId);
      }

      // Calculate total price after both details are loaded
      this.calculateTotalPrice();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }


  /**
  * @method showError 
  * @description Displays an error message for a specified duration.
  * @param {string} message - The error message to be displayed. 
  * @param {number} [duration=2500] - Optional duration for the error message display in milliseconds.
  */
  showError(message: string, duration = 3000): void {

    // Prevent multiple overlapping error messages
    if (this.paymentError) return;

    // Set the error message and display state
    this.errorMessage = message
    this.paymentError = true

    setTimeout(() => {
      this.paymentError = false
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
    if (this.paymentSuccess) return

    // Set the error message and display state
    this.successMessage = message
    this.paymentSuccess = true

    setTimeout(() => {
      this.paymentSuccess = false
      this.successMessage = ''
    }, duration);
  }

  /**
  * @method fetchBookingDetails
  * @description Fetches the booking details for the current booking ID by calling the `getBookingById` service.
  * It handles both success and error scenarios, updating the component state or logging errors as needed.
  * 
  * @returns {Promise<void>} Resolves once the booking details have been successfully fetched and processed.
  * @throws Will log an error if the booking retrieval fails.
  */
  async fetchBookingDetails(): Promise<void> {

    try {

      // Ensure the booking ID is valid
      if (!this.id) {
        console.log('Booking ID is not defined or invalid.')
        return
      }

      // Fetch booking details using the service
      this.bookingDetails = await this.roomService.getBookingById(this.id)

      // Handle the fetched booking details
      console.log('Booking Details:', this.bookingDetails)
    } catch (error) {
      // Handle any errors during the fetch operation
      console.log('Error retrieving booking:', error)
    }
  }

  /**
  * @async
  * @method fetchRoomDetails
  * @description Fetches room details for the specified room ID by calling the `getRoomById` service. 
  * Validates the room ID, updates the component's state, and logs errors if the operation fails.
  * 
  * @param {any} roomId - The unique identifier of the room to fetch details for.
  * @returns {Promise<void>} Resolves once the room details have been successfully fetched and processed.
  * @throws Will log an error if the room retrieval fails.
  */
  async fetchRoomDetails(roomId: any): Promise<void> {

    try {

      // Ensure the room ID is valid
      if (!roomId) {
        console.log('Room ID is not defined or invalid.')
        return
      }

      // Fetch room details using the service
      this.roomDetails = await this.roomService.getRoomById(roomId)

    } catch (error) {
      // Handle any errors during the fetch operation
      console.log('Error retrieving room:', error)
    }
  }

  /**
  * Calculates the total price for the booking by determining the number of nights
  * between the check-in and check-out dates and multiplying by the room price.
  * 
  * @method calculateTotalPrice
  * @description This method ensures valid booking and room details are available, 
  * validates check-in and check-out dates, calculates the duration of the stay in nights, 
  * and computes the total price based on the room price.
  * 
  * @throws Logs errors and returns early if validation fails at any stage.
  */
  calculateTotalPrice(): void {

    try {

      // Step 1: Validate booking and room details
      if (!this.bookingDetails || !this.roomDetails) {
        console.log('Booking or room details are missing.')
        return
      }

      // Step 2: Extract and validate check-in and check-out dates
      const checkInString = this.bookingDetails.checkIn;
      const checkOutString = this.bookingDetails.checkOut;

      // Ensure both check-in and check-out dates are valid strings
      if (!checkInString || !checkOutString) {
        console.log('Check-in or check-out date is missing.');
        return;
      }

      // Parse the dates into JavaScript Date objects
      const checkIn = new Date(checkInString);
      const checkOut = new Date(checkOutString);

      // Validate that the parsed dates are valid
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        console.log('Invalid check-in or check-out date.');
        return;
      }

      // Step 3: Calculate the difference in nights
      this.nights = this.getDateDifference(checkIn, checkOut);

      // Ensure nights are positive (check-out must be after check-in)
      if (this.nights <= 0) {
        console.log('Check-out date must be after check-in date.');
        return;
      }

      // Step 4: Calculate the total price
      this.totalPrice = this.nights * this.roomDetails.price;

      // Log for debugging
      console.log('Total Price:', this.totalPrice);
    } catch (error) {
      console.log('Error calculating total price:', error);
    }
  }

  /**
   * Calculates the difference in days between two dates.
   * 
   * @param {Date} startDate - The start date.
   * @param {Date} endDate - The end date.
   * @returns {number} The number of days between the two dates.
   */
  getDateDifference(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / msInDay);
  }

  /**
  * Handles the submission of payment details, validates user inputs, 
  * and processes the payment via the room service. 
  * Provides feedback to the user on success or failure.
  *
  * @async
  * @method submitPayment
  * @returns {Promise<void>} Resolves when the payment process is completed successfully.
  */
  async submitPayment(): Promise<void> {

    try {

      // Step 1: Validate form inputs
      if (this.paymentForm.invalid) {
        this.showError('Please fill out all required fields.')
        return
      }

      // Step 2: Extract user input from the form
      const cardHolder = this.paymentForm.get('cardHolder')?.value
      const cardNumber = this.paymentForm.get('cardNumber')?.value
      const expiryDate = this.paymentForm.get('expiryDate')?.value
      const cvv = this.paymentForm.get('cvv')?.value

      console.log('Payment Details:', { cardHolder, cardNumber, expiryDate, cvv })

      // step 3: Process the payment via the room service
      await this.roomService.processBookingPayment(this.id, this.totalPrice, this.nights)

      // Step 4: Provide success feedback to the user
      this.paymentForm.reset()
      this.showSuccess('Thank you for completing your payment!')
      console.log('Thank you for completing your payment.')

      // Step 5: Navigate to the view bookings page after a short delay
      setTimeout(() => {
        this.router.navigate(['/view-booking'])
      }, 3500)

    } catch (error) {

      // Handle errors during payment processing
      console.log('Payment processing failed:', error);
      this.showError('Submission of payment failed. Please try again later.')
    }
  }


}
