import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgClass, NgFor, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator'

@Component({
  selector: 'app-rooms-admin',
  imports: [RouterLink, NgFor,FormsModule,NgClass,MatPaginatorModule,SlicePipe],
  templateUrl: './rooms-admin.component.html',
  styleUrl: './rooms-admin.component.css'
})
export class RoomsAdminComponent {

  /**
   * @property {any[]} rooms 
   */
  rooms: any[] = []

  /**
  * Temporary array used for intermediate calculations or manipulation.
  * @property {any[]} originalProducts - Auxiliary array for data processing.
  */
  originalRooms: any[] = []

   /**
   * Represents the search input entered by the user for filtering rooms.
   * @property {string} search - Search keyword for filtering rooms.
   */
   search: string = ""

   /**
   * @property {string} selectedRoomType 
   */ 
   selectedRoomType : string = ''

   /**
   * @property {string} selectedStatus
   */
   selectedStatus: string = '' 

   /**
   * Represents the total number of rooms available.
   * @property {number} items - Total count of rooms.
   */
   items: number = 0

   /**
   * Represents the current page index in the pagination.
   * @property {number} currentpage - Zero-based index of the current page.
   */
   currentpage: number = 0

   /**
   * Represents the index of the first product displayed on the current page.
   * @property {number} lowIndex - Starting index for pagination.
   */
   lowIndex: number = 0

   /**
   * Represents the index of the last product displayed on the current page.
   * @property {number} highIndex - Ending index for pagination.
   */
   highIndex: number = 6

  /**
   * @constructor
   * @description 
   * @param router 
   * @param roomService 
   */
  constructor(private router:Router,private roomService:RoomService){}

  /**
   * @description 
   */
  ngOnInit(){
   
    // call the helper function to to fetch all rooms
    this.fetchRooms()
  }

  /**
  * Fetches and updates the list of rooms from the database.
  * 
  * @async
  * @method fetchRooms
  * @description Retrieves room data by calling the `getRooms` method from the `roomService`.
  * Updates the component's `rooms` property with the fetched data.
  * Logs the retrieved data for debugging purposes.
  * 
  * @returns {Promise<void>} Resolves when the rooms have been successfully fetched and stored.
  * @throws {Error} Logs an error if the room retrieval process fails.
  */
  async fetchRooms(): Promise<void>{

    try {

      // Call the room service to fetch room data
      this.originalRooms = await this.roomService.getRooms()
      this.rooms = this.originalRooms

      // Update total room count
      this.items = this.rooms.length
 
    } catch (error) {

      // Handle and log errors during the fetch process
      console.log('Error fetching rooms:', error)
    }
  }

  /**
  * Navigates to the "Add Room" page.
  * @method goToAddRoom
  * @description Redirects the user to the page where a new room can be added. Handles potential navigation errors.
  * @throws {Error} Throws an error if the navigation fails.
  */
  goToAddRoom(): void {

    try {

      this.router.navigate(['/add-room'])

    } catch (error) {

      throw new Error("Failed to navigate to the Add Room page. Please try again.")
    }
  }

  /**
 * Navigates to the "Room Details" page for the specified room ID.
 * @method goToRoomDetails
 * @description Redirects the user to the details page for a specific room. Validates the room ID and handles potential navigation errors.
 * @param {any} id - The unique identifier of the room.
 * @throws {Error} Throws an error if the navigation fails or the `id` is invalid.
 */
  goToRoomDetails(id: any) {

    if (!id) {
      throw new Error("Room ID is required to navigate to the room details page.")
    }

    try {

      // Store ID in sessionStorage before navigating
      sessionStorage.setItem('id', id)

      this.router.navigate(['/room-details-admin'], {state : {id}})

    } catch (error) {

      throw new Error("Failed to navigate to the room details page. Please try again.")
    }

  }

 /**
 * Navigates to the "Book Room" page with the provided room ID.
 * @method goToBookRoom
 * @description Redirects the user to the booking page for the specified room. Ensures the `id` is valid and handles navigation errors.
 * @param { string: number } id - The unique identifier of the room to be booked.
 * @throws {Error} Throws an error if the navigation fails or the `id` is invalid.
 */
  goToBookRoom(id: any): void {

    if (!id) {
      console.log("Invalid room ID provided.");
      throw new Error("Room ID is required to navigate to the booking page.");
    }

    try {

      // Store ID in sessionStorage before navigating
      sessionStorage.setItem('id', id)

      this.router.navigate(['/book-room'], {state: {id}})
   
    } catch (error) {

      throw new Error("Failed to navigate to the booking page. Please try again.")
    }
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

  /**
  * Filters the list of rooms based on the user's search input.
  * 
  * @method onSearch
  * @returns {void}
  * 
  * @description
  * This method filters the `rooms` array using the search term entered by the user.
  * If the search term is empty or invalid, it resets the 'rooms' array to the original list.
  * The search matches against room type, price, capacity, and description fields.
  */ 
  onSearch(): void{

      try {
        
        const term = this.search?.toLowerCase() || ''
  
        // If the search term is empty, reset the rooms list
        if (!term.trim()) {
          // Create a fresh copy of the original array
          this.rooms = [...this.originalRooms] 
          return
        }
  
        // Filter rooms based on the search term
        this.rooms = this.originalRooms.filter(room =>{
  
        const matchesSearch = 
        room.roomType.toLowerCase().includes(term) ||
        room.status.toLowerCase().includes(term) ||
        room.services.toLowerCase().includes(term) 

        const matchesNumberFields =
        room.price?.toString().includes(term) ||
        room.capacity?.toString().includes(term) || 
        room.roomNumber?.toString().includes(term)
       
        return matchesSearch || matchesNumberFields 
      })
  
      } catch (error) {
        console.log('Error occurred during search operation:', error)
      }
  }

  /**
  * Filters the list of rooms based on the selected room type.
  *
  * @async
  * @method onFilterRoomType
  * @description Fetches rooms filtered by the selected room type from the `RoomService` 
  * and updates the `rooms` list. If 'all' is selected, it fetches all available rooms.
  *
  * @returns {Promise<void>} Resolves when the filtering operation is complete.
  * @throws {Error} Logs an error if the filtering process fails.
  */
  async onFilterRoomType() : Promise<void> {

    try {
      // Ensure a valid room type is selected
      if (!this.selectedRoomType || this.selectedRoomType.trim() === '') {
        console.log('No room type selected for filtering.')
        return
      }

      if(this.selectedRoomType.toLowerCase() === 'all'){
        // Fetch all rooms when 'all' is selected
        await this.fetchRooms()
      }
      else{
        // Fetch rooms filtered by the selected room type
        this.rooms = await this.roomService.filterRoomsByType(this.selectedRoomType)
      }
      
    } catch (error) {
      console.log('Error occurred while filtering rooms by type:', error)
    }
  }

  /**
  * Filters rooms based on the selected status (e.g., "Available", "Booked", "Maintenance").
  *
  * @async
  * @method onFilterRoomStatus
  * @returns {Promise<void>} A promise that resolves when filtering is complete.
  * @description 
  * - If 'All' is selected, fetches all rooms.
  * - Otherwise, fetches rooms filtered by the selected status.
  * - Logs any errors that occur during the filtering process.
  */
  async onFilterRoomStatus() : Promise<void> {

    try {
      // Ensure a valid room status is selected
      if (!this.selectedStatus || this.selectedStatus.trim() === '') {
        console.log('Room status is required for filtering.')
        return
      }

      if(this.selectedStatus.toLowerCase() === 'all'){
       // Fetch all rooms when 'all' is selected
       await this.fetchRooms() 
      }
      else{
        // Fetch rooms filtered by the selected status
        this.rooms = await this.roomService.filterRoomsByStatus(this.selectedStatus)
      }

    } catch (error) {
      console.log('Error occurred while filtering rooms by status:', error)
    }
  }
  
}
