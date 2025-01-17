import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator'
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-rooms',
  imports: [RouterLink, NgFor, FormsModule,MatPaginatorModule,SlicePipe,NgIf],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

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
   highIndex: number = 8

   /**
    * @property {boolean} isLoggedIn
    */
    isLoggedIn: boolean = false

   /**
   * @constructor
   * @description 
   * @param {Router} router 
   * @param {RoomService} roomService 
   * @param {AuthService} authService
   */
  constructor(private router:Router,private roomService: RoomService,private authService: AuthService){}

  /**
   * @description 
   */
  ngOnInit() {

    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
    })

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

      // Log the fetched rooms for debugging purposes
      console.log('Rooms:', this.rooms)

    } catch (error) {
      // Handle and log errors during the fetch process
      console.error('Error fetching rooms:', error)
    }

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
      room.description.includes(term) ||
      room.services.includes(term)
     
      return matchesSearch
    })

    } catch (error) {
      console.log('Error occurred during search operation:', error)
    }
  }

  /**
   * @method goToBookRoom
   * @description 
   */
  goToBookRoom(){

    this.router.navigate(['/book-room'])
  }

  /**
   * @method goToRoomDetails
   * @description - Navigates to the room details page.
   * @param {any} roomID - The ID of the room to view details for.
   */
  goToRoomDetails(id: any){

    this.router.navigate(['/room-details', id])    
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
