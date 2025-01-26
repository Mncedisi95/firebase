import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  imports: [RouterLink,NgIf],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent {

  /**
  * @property {any} id
  */
  id : any

  /**
  * @property {any} bookingDetails
  */
   bookingDetails : any = null

  /** 
  * @property {any} roomDetails 
  */ 
  roomDetails : any = null

  /**
   * @property {any} guestDetails
   */
  guestDetails : any = null

  /**
   * @property {any} paymentDetails
   */
  paymentDetails: any = null

  /**
  * @constructor 
  * @param {ActivatedRoute} route
  * @param {RoomService} roomSevice
  * @param {PaymentService} paymentService
  */
  constructor(private route: ActivatedRoute, private roomService: RoomService,private userService: UserService,private paymentService: PaymentService){}

  /**
  * @description 
  */
   async ngOnInit() : Promise<void>{

    try {

      this.id = this.route.snapshot.paramMap.get('id')

      await this.fetchCompleteBookingDetails()
       
    } catch (error) {

      console.error('Error during initialization:', error)
    }
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
      this.bookingDetails = await this.roomService.getBookingById(this.id);
      console.log('Booking Details:', this.bookingDetails);

      if (!this.bookingDetails) {
        console.error('No booking details found for the provided ID.');
        return;
      }

      const roomId = this.bookingDetails?.roomId;
      const guestId = this.bookingDetails?.userId;
      const bookingId = this.bookingDetails?.id;

      console.log('booking id sent is:' + bookingId)
      
      // Use Promise.all to fetch room, guest, and payment details in parallel
      const [roomDetails, guestDetails, paymentDetails] = await Promise.all([
        roomId ? this.roomService.getRoomById(roomId) : Promise.resolve(null),
        guestId ? this.userService.getGuestById(guestId) : Promise.resolve(null),
        bookingId ? this.paymentService.getPaymentByBookingId(bookingId) : Promise.resolve(null),
      ]);

      this.roomDetails = roomDetails;
      this.guestDetails = guestDetails;
      this.paymentDetails = paymentDetails;

      console.log('Room Details:', this.roomDetails);
      console.log('Guest Details:', this.guestDetails);
      console.log('Payment Details:', this.paymentDetails);
    } catch (error) {
      console.error('Error fetching complete booking details:', error);
    }
  }

  updateStatus(event: any) {
    // API call to update booking status
    console.log('Status updated to:');
  }

  editBooking() {
    // Redirect to edit booking page
    console.log("Editing booking...");
  }

  cancelBooking() {
    // API call or modal confirmation to cancel booking
    console.log("Booking cancelled.");
  }

}
