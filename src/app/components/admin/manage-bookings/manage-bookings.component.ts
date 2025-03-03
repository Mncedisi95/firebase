import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {  NgFor, NgIf } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SortByDatePipe } from '../../../sort-by-date.pipe';
import { RoomService } from '../../../services/room.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-manage-bookings',
  imports: [NgFor,RouterLink,SortByDatePipe,NgIf,MatProgressSpinnerModule,MatPaginator],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.css'
})
export class ManageBookingsComponent {

  /**
  * @property {any[]} bookings - Array of booking objects retrieved from the backend.
  * Each booking object includes user and room details after being enriched
  */
  bookings : any[] = []

  /** @property {boolean} isLoading */

  isLoading : boolean = false

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

      // Set loading state to true before starting the fetch process
      this.isLoading = true

      // Simulate lazy loading delay
      setTimeout(async () => {

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
        
        // Update total bookings count
        this.items = this.bookings.length

        // Hide spinner after data is loaded
        this.isLoading = false
        
      }, 1000) // 1-second delay for effect

    } catch (error) {
      
      console.log('Error retrieving bookings or related details:', error)
      // Ensure spinner is hidden on error
      this.isLoading = false
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
