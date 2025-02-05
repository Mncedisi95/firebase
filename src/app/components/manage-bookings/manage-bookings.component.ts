import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import {  NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { SortByDatePipe } from '../../sort-by-date.pipe';


@Component({
  selector: 'app-manage-bookings',
  imports: [NgFor,RouterLink,SortByDatePipe,NgIf],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.css'
})
export class ManageBookingsComponent {

  /**
  * @property {any[]} bookings - Array of booking objects retrieved from the backend.
  * Each booking object includes user and room details after being enriched
  */
  bookings : any[] = []
  
  /**
  * @constructor
  * @description Initializes the component, injects required services, and prepares for booking management.
  * @param {Router} router - Angular Router for navigating to different views.
  * @param {RoomService} roomService - Service to interact with room-related APIs.
  * @param {UserService} userService - Service to fetch user details based on IDs.
  */
  constructor(
    private router: Router,
    private roomService: RoomService,
    private userService: UserService
  ) {}

  /**
  * @method ngOnInit
  * @description Lifecycle method called when the component is initialized. Fetches and processes all bookings.
  * @returns {void}
  */
  ngOnInit(){
    // Load all Bookings
    this.fetchAllBookings()
  }

  /**
  * @method fetchAllBookings
  * @description Fetches all bookings from the room service, retrieves additional guest and room details based on their IDs, and displays the enriched booking data.
  * @returns {Promise<void>} - A promise that resolves when the bookings and their details are fetched and processed.
  * @throws {Error} Throws an error if fetching bookings or related details fails.
  */
  async fetchAllBookings(){

    try {
  
      // Step 1: Fetch all bookings from the room service
      this.bookings = await this.roomService.getBookings()
     
      // Step 2: Enrich booking data with guest and room details
      this.bookings = await Promise.all(this.bookings.map(async (booking) => {

        const { userId, roomId } = booking

        // Fetch guest details by ID
        const guestDetails = await this.userService.getGuestById(userId)

        // Fetch room details by ID
        const roomDetails = await this.roomService.getRoomById(roomId)

        // Return the enriched booking object
        return {
          ...booking,
          guest: guestDetails,
          room: roomDetails,
        }
      })) 

    } catch (error) {
      
      console.log('Error retrieving bookings or related details:', error)
    }
  }

  /**
  * @method goToViewBooking
  * @description Navigates to the booking details page for a specific booking.
  * @param {string} id - The ID of the booking to view.
  * @returns {void}
  */
  goToViewBooking(id: any) : void {
    
    sessionStorage.setItem('id',id)

    this.router.navigate(['/booking-details'],{state: {id}})
  }

}
