import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { DatePipe, NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { SortByDatePipe } from '../../sort-by-date.pipe';


@Component({
  selector: 'app-manage-bookings',
  imports: [NgFor,RouterLink,SortByDatePipe],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.css'
})
export class ManageBookingsComponent {

  /**
  * @property {any[]} bookings
  */
  bookings : any[] = []
  
  /**
  * @constructor
  * @param {Router} router 
  */
  constructor(private router: Router,private roomService: RoomService,private userService: UserService){}


  /**
  * @description 
  */
  ngOnInit(){

    // Load Bookings
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
      console.log('Bookings fetched successfully:', this.bookings)

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

      // Step 3: Log the enriched bookings
      console.log('Enriched Bookings:', this.bookings)

    } catch (error) {
      
      console.log('Error retrieving bookings or related details:', error)
    }
  }

  deleteBooking(id: string): void {
    console.log('Delete booking with ID:', id);
  }

  /**
  * @method
  * @description
  */
  goToViewBooking(id: any){

    this.router.navigate(['/booking-details', id])
  }

}
